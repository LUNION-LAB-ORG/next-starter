"use client";

import { useState } from "react";
import { ListItemNode, ListNode } from "@lexical/list";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { EditorState, ParagraphNode, TextNode } from "lexical";
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph";
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading";
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { Card, CardContent } from "@/components/ui/card";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
  ],
  onError: (error: Error) => {
    console.error(error);
  },
};

const placeholder = "Une très belle villa...";

type EditorFieldProps = {
  editorSerializedState?: EditorState;
  handleChange?: (value: EditorState) => void;
  className?: string;
};

export function EditorField({
  editorSerializedState,
  handleChange,
  className,
}: EditorFieldProps) {
  const [, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        ...(editorSerializedState
          ? { editorState: JSON.stringify(editorSerializedState) }
          : {}),
      }}
    >
      <Card>
        <CardContent className="relative">
          <ToolbarPlugin>
            {() => (
              <div className="sticky top-0 z-10 flex gap-2 overflow-auto p-1">
                <BlockFormatDropDown>
                  <FormatParagraph />
                  <FormatHeading levels={["h1", "h2", "h3"]} />
                  <FormatNumberedList />
                  <FormatBulletedList />
                </BlockFormatDropDown>
                <ElementFormatToolbarPlugin />
                <FontFormatToolbarPlugin />
              </div>
            )}
          </ToolbarPlugin>

          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <div className="">
                  <div className="" ref={onRef}>
                    <ContentEditable
                      placeholder={placeholder}
                      className="relative block h-72 overflow-auto px-8 py-4 focus:outline-none"
                    />
                  </div>
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <ListPlugin />
            <CheckListPlugin />
            <OnChangePlugin
              onChange={(editorState) => {
                handleChange?.(editorState);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </LexicalComposer>
  );
}
