import { marked } from "marked";
import beautify from "js-beautify";

export const convertTextToHTML = (text: string, parseMD: boolean = true) => {
  const outputText = ((text, parseMD): string => {
    if (parseMD) return marked.parse(text, { breaks: true }).replaceAll(/<br>/g, "<br>\n");

    const paragraphs = text.split(/\n{2}/);
    return paragraphs.reduce((prev, value) => {
      if (value) {
        const parsedText = value
          .replace(/^[ \r\n\t\uFEFF\xA0]+|[ \t\r\n\uFEFF\xA0]+$/g, "")
          .replaceAll(/\n/g, "<br>\n");

        return `${prev}<p>${parsedText}</p>`;
      } else {
        return prev;
      }
    }, "");
  })(text, parseMD);

  const beautifyOptions: beautify.HTMLBeautifyOptions = {
    indent_size: 0,
    end_with_newline: true,
    preserve_newlines: true,
    max_preserve_newlines: 0,
    wrap_line_length: 1,
    wrap_attributes_indent_size: 0,
    unformatted: ["strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ruby", "rt"],
    content_unformatted: [],
  };

  return beautify.html(outputText, beautifyOptions);
};
