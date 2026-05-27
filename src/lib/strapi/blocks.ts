import { renderBlock, type Node } from "blocks-html-renderer";

export const renderStrapiBlocks = (content: unknown): string => {
  if (!Array.isArray(content) || content.length === 0) {
    return "";
  }

  try {
    return renderBlock(content as Node[]);
  } catch {
    return "";
  }
};
