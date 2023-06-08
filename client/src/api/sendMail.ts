import { ApiClient } from ".";

interface IMail {
  sender: string;
  subject: string;
  message: string;
  properties: Record<string, string | number>;
}

export interface ISendMailResponse {
  message: string;
  success: boolean;
}

export async function sendMail(mail: IMail): Promise<ISendMailResponse> {
  try {
    const res = await ApiClient?.post("/mail", mail, { withCredentials: true });

    if (!res) {
      throw new Error("Response object is undefined");
    }

    if (res.status.toString()[0] == "2") {
      return {
        message: "Message has been sent successfully!",
        success: true,
      };
    } else {
      throw new Error(res.data);
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Message couldn't be sent.",
      success: false,
    };
  }
}
