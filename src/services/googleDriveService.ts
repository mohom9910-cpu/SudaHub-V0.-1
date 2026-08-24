// Google Drive integration for SudaHub platform
declare global {
  interface Window {
    google?: any;
  }
}

export interface DriveUploadResult {
  id: string;
  name: string;
  webViewLink?: string;
  mimeType?: string;
  size?: string;
}

export class GoogleDriveService {
  private static accessToken: string | null = null;
  private static clientId: string = '';

  public static setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('sudahub_gdrive_token', token);
  }

  public static getToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('sudahub_gdrive_token');
    }
    return this.accessToken;
  }

  public static clearToken() {
    this.accessToken = null;
    localStorage.removeItem('sudahub_gdrive_token');
  }

  /**
   * Request Access Token from Google OAuth GSI
   */
  public static async requestAuth(clientId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        return reject(new Error('Browser environment required'));
      }

      if (!window.google?.accounts?.oauth2) {
        return reject(new Error('Google Identity Services script not loaded. Please ensure you are connected to the internet.'));
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId || this.clientId || '702458638480-web.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
        callback: (response: any) => {
          if (response.error) {
            return reject(new Error(response.error_description || response.error));
          }
          if (response.access_token) {
            this.setToken(response.access_token);
            return resolve(response.access_token);
          }
          reject(new Error('No access token returned'));
        },
      });

      client.requestAccessToken();
    });
  }

  /**
   * Create or sync real Google Sheet with purchase orders
   */
  public static async syncGoogleSheetOrders(
    sheetRows: Array<{
      transactionId: string;
      orderId: string;
      dateTime: string;
      serviceType: string;
      planName: string;
      amount: number;
      currency: string;
      status: string;
      customerEmail: string;
      syncedAt: string;
    }>,
    existingSpreadsheetId?: string
  ): Promise<{ spreadsheetId: string; spreadsheetUrl: string; rowCount: number }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('يرجى تسجيل الدخول إلى Google أولاً لمزامنة Google Sheets.');
    }

    const headers = [
      "رقم المعاملة (Transaction ID)",
      "رقم الطلب (Order ID)",
      "تاريخ ووقت العملية (Date & Time)",
      "نوع الخدمة (Service)",
      "نوع الباقة (Plan)",
      "المبلغ المدفوع (Amount)",
      "العملة (Currency)",
      "حالة العملية (Status)",
      "بريد العميل (Customer Email)",
      "حساب المستلم المعتمد",
      "وقت آخر مزامنة"
    ];

    const values = [
      headers,
      ...sheetRows.map(r => [
        r.transactionId,
        r.orderId,
        r.dateTime,
        r.serviceType,
        r.planName,
        r.amount,
        r.currency,
        r.status, // "قيد المعالجة (Pending)" | "نجاح (Success)" | "فشل (Failed)"
        r.customerEmail,
        "9138127 (محمد عمر بابكر)",
        r.syncedAt
      ])
    ];

    let sheetId = existingSpreadsheetId || localStorage.getItem('sudahub_active_sheet_id') || '';

    // Create if doesn't exist
    if (!sheetId) {
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: `SudaHub | سجل عمليات الشراء والاشتراكات - ${new Date().getFullYear()}`
          },
          sheets: [
            {
              properties: {
                title: 'سجل العمليات (Orders)',
                gridProperties: {
                  frozenRowCount: 1
                }
              }
            }
          ]
        })
      });

      if (!createRes.ok) {
        if (createRes.status === 401) {
          this.clearToken();
          throw new Error('انتهت صلاحية جلسة Google. يرجى تسجيل الدخول مجدداً.');
        }
        const errJson = await createRes.json().catch(() => ({}));
        throw new Error(errJson.error?.message || 'فشل إنشاء صفحة Google Sheets عبر Google API.');
      }

      const created = await createRes.json();
      sheetId = created.spreadsheetId;
      localStorage.setItem('sudahub_active_sheet_id', sheetId);
    }

    // Populate or update data
    const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/سجل العمليات (Orders)!A1?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: 'سجل العمليات (Orders)!A1',
        majorDimension: 'ROWS',
        values
      })
    });

    if (!updateRes.ok) {
      const errJson = await updateRes.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'فشل تحديث البيانات في صفحة Google Sheets.');
    }

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    return {
      spreadsheetId: sheetId,
      spreadsheetUrl,
      rowCount: sheetRows.length
    };
  }

  /**
   * Upload file to Google Drive using multipart upload
   */
  public static async uploadFile(
    filename: string,
    content: string | Blob,
    mimeType: string = 'application/json',
    token?: string
  ): Promise<DriveUploadResult> {
    const authToken = token || this.getToken();
    if (!authToken) {
      throw new Error('لم يتم تسجيل الدخول إلى Google Drive. يرجى المصادقة أولاً.');
    }

    const metadata = {
      name: filename,
      mimeType: mimeType,
      description: 'تم تصديره وتوليده بواسطة منصة SudaHub الرقمية',
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const fileBlob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
    const fileText = typeof content === 'string' ? content : await fileBlob.text();

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n\r\n` +
      fileText +
      closeDelimiter;

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,mimeType,size',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        throw new Error('انتهت صلاحية جلسة Google Drive. يرجى إعادة تسجيل الدخول.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `فشل رفع الملف إلى Google Drive (${response.status})`);
    }

    const result = await response.json();
    return {
      id: result.id,
      name: result.name,
      webViewLink: result.webViewLink || `https://drive.google.com/file/d/${result.id}/view`,
      mimeType: result.mimeType,
      size: result.size,
    };
  }
}
