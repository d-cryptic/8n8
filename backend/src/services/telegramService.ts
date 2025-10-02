import axios from "axios";

interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: "HTML" | "Markdown" | "MarkdownV2";
  replyToMessageId?: number;
  disableWebPagePreview?: boolean;
}

interface TelegramSendMessageResponse {
  ok: boolean;
  result?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username: string;
    };
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      type: string;
    };
    date: number;
    text: string;
  };
  error_code?: number;
  description?: string;
}

export class TelegramService {
  private botToken: string;

  constructor(botToken: string) {
    this.botToken = botToken;
  }

  async sendMessage(
    message: TelegramMessage,
  ): Promise<TelegramSendMessageResponse> {
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          chat_id: message.chatId,
          text: message.text,
          parse_mode: message.parseMode || "HTML",
          reply_to_message_id: message.replyToMessageId,
          disable_web_page_preview: message.disableWebPagePreview || false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Telegram send message error:",
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to send Telegram message: ${
          error.response?.data?.description || error.message
        }`,
      );
    }
  }

  async getBotInfo(): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot/${this.botToken}/getMe`,
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Telegram get bot info error:",
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to get bot info: ${
          error.response?.data?.description || error.message
        }`,
      );
    }
  }

  async getUpdates(offset?: number, limit: number = 100): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${this.botToken}/getUpdates`,,
        {
          params: {
            offset,
            limit,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Telegram get updates error:",
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to get updates: ${error.response?.data?.description || error.message
        }`,
      );
    }
  }

  async setWebhook(url: string, secretToken?: string): Promise<any>{
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${this.botToken}/setWebhook`,
        {
          url,
          secret_token: secretToken,
        },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Telegram set webhook error:",
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to set webhook: ${error.response?.data?.description || error.message
        }`,
      );
    }
  }

  async deleteWebhook(): Promise<any> {
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${this.botToken}/deleteWebhook`,
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Telegram delete webhook error:",
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to delete webhook: ${error.response?.data?.description || error.message
        }`,
      );
    }
  }

  async sendPhoto(
    chatId: string,
    photo: string | Buffer,
    caption?: string,
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("photo", photo);
      if (caption) {
        formData.append("caption", caption);
      }

      const response = await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendPhoto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Telegram send photo error:",
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to send photo: ${error.response?.data?.description || error.message
        }`,
      );
    }
  }

  async sendDocument(
    chatId: string,
    document: string | Buffer,
    caption?: string,
  ): Promise<any>{
    try {
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("document", document);
      if (caption) {
        formData.append("caption", caption);
      }

      const response = await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendDocument`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Telegram send document error:",
        error.response?.data || error.message,
      );
      throw new Error(
        `Failed to send document: ${error.response?.data?.description || error.message
        }`,
      );
    }
  }
}

export const createTelegramService = (botToken: string): TelegramService => {
  return new TelegramService(botToken);
};

export const validateTelegramToken = async (
  botToken: string,
): Promise<boolean> => {
  try {
    const service = new TelegramService(botToken);
    const response = await service.getBotInfo();
    return response.ok === true;
  } catch (error) {
    return false;
  }
};