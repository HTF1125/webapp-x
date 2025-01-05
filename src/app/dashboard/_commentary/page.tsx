"use client";
import React, { useEffect, useState } from "react";
import { fetchMarketCommentary, MarketCommentary } from "./DataServices";
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader, Alert } from "@mantine/core";
import { Link } from "@mantine/tiptap";
import { FloatingMenu } from '@tiptap/react';

const MarketCommentaryComponent: React.FC = () => {
  const [commentary, setCommentary] = useState<MarketCommentary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMarketCommentary()
      .then((data) => {
        setCommentary(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch market commentary");
        setLoading(false);
      });
  }, []);

  // Initialize the editor only after commentary data is fetched
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: commentary?.content || "", // Set initial content when commentary is fetched
    editable: false, // Make the editor read-only
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Alert title="Error" color="red">{error}</Alert>;
  }

  return (
    <div>
      <h2>Market Commentary</h2>
      <p>
        <strong>Date:</strong> {commentary?.asofdate}
      </p>
      <p>
        <strong>Frequency:</strong> {commentary?.frequency}
      </p>
      <div>
        <strong>Content:</strong>
        {editor ? (
          <RichTextEditor editor={editor}>
            <FloatingMenu editor={editor}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.BulletList />
              </RichTextEditor.ControlsGroup>
            </FloatingMenu>
            <RichTextEditor.Content />
          </RichTextEditor>
        ) : (
          <p>No content available</p>
        )}
      </div>
    </div>
  );
};

export default MarketCommentaryComponent;
