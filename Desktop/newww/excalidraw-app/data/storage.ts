/**
 * Storage abstraction layer that automatically uses Supabase if available,
 * otherwise falls back to Firebase for backward compatibility.
 */

import type Portal from "../collab/Portal";
import type { Socket } from "socket.io-client";
import type {
  ExcalidrawElement,
  FileId,
} from "@excalidraw/element/types";
import type { AppState, BinaryFileData } from "@excalidraw/excalidraw/types";
import type { SyncableExcalidrawElement } from ".";

import {
  saveToFirebase,
  loadFromFirebase,
  saveFilesToFirebase,
  loadFilesFromFirebase,
  isSavedToFirebase,
} from "./firebase";

import {
  saveToSupabase,
  loadFromSupabase,
  saveFilesToSupabase,
  loadFilesFromSupabase,
  isSavedToSupabase,
} from "./supabase";

// Check if Supabase is configured
const isSupabaseAvailable = () => {
  return !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
};

// Scene storage functions
export const saveScene = async (
  portal: Portal,
  elements: readonly SyncableExcalidrawElement[],
  appState: AppState,
) => {
  if (isSupabaseAvailable()) {
    try {
      return await saveToSupabase(portal, elements, appState);
    } catch (error) {
      console.warn("Supabase save failed, falling back to Firebase:", error);
      return await saveToFirebase(portal, elements, appState);
    }
  }
  return await saveToFirebase(portal, elements, appState);
};

export const loadScene = async (
  roomId: string,
  roomKey: string,
  socket: Socket | null,
) => {
  if (isSupabaseAvailable()) {
    try {
      const result = await loadFromSupabase(roomId, roomKey, socket);
      if (result) return result;
    } catch (error) {
      console.warn("Supabase load failed, falling back to Firebase:", error);
    }
  }
  return await loadFromFirebase(roomId, roomKey, socket);
};

export const isSceneSaved = (
  portal: Portal,
  elements: readonly ExcalidrawElement[],
): boolean => {
  if (isSupabaseAvailable()) {
    return isSavedToSupabase(portal, elements);
  }
  return isSavedToFirebase(portal, elements);
};

// File storage functions
export const saveFiles = async ({
  prefix,
  files,
}: {
  prefix: string;
  files: { id: FileId; buffer: Uint8Array }[];
}) => {
  if (isSupabaseAvailable()) {
    try {
      return await saveFilesToSupabase({ prefix, files });
    } catch (error) {
      console.warn("Supabase file save failed, falling back to Firebase:", error);
      return await saveFilesToFirebase({ prefix, files });
    }
  }
  return await saveFilesToFirebase({ prefix, files });
};

export const loadFiles = async (
  prefix: string,
  decryptionKey: string,
  filesIds: readonly FileId[],
) => {
  if (isSupabaseAvailable()) {
    try {
      return await loadFilesFromSupabase(prefix, decryptionKey, filesIds);
    } catch (error) {
      console.warn("Supabase file load failed, falling back to Firebase:", error);
      return await loadFilesFromFirebase(prefix, decryptionKey, filesIds);
    }
  }
  return await loadFilesFromFirebase(prefix, decryptionKey, filesIds);
};
