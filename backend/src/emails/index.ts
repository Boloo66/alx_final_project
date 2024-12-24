import fs from "fs/promises";
import path from "path";

const loadHtmlTemplate = async (
  templatePath: string,
  data: Record<string, string>
) => {
  try {
    console.log({ templatePath });

    let html = await fs.readFile(templatePath, "utf8");

    console.log({ html });

    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      html = html.replace(regex, value);
    }

    return html;
  } catch (error) {
    console.error("Error loading HTML template:", error);
    throw new Error("Could not load email template");
  }
};

export default loadHtmlTemplate;
