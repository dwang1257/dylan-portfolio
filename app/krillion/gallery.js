"use client";

import Image from "next/image";
import {
  startTransition,
  useEffect,
  useEffectEvent,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import { upload } from "@vercel/blob/client";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { addShot, deleteShot, updateCaption } from "./actions";

const EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const GRID_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

async function measure(file) {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

function hasFiles(event) {
  return event.dataTransfer?.types.includes("Files");
}

export default function Gallery({ shots, owner }) {
  const [visibleShots, hideShot] = useOptimistic(shots, (state, id) =>
    state.filter((shot) => shot.id !== id)
  );
  const [openIndex, setOpenIndex] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState(null);
  const [busy, startUpload] = useTransition();

  function uploadFiles(fileList) {
    const files = [...fileList];
    const images = files.filter((file) => EXTENSIONS[file.type]);
    if (!images.length) {
      if (files.length) setStatus("Only PNG, JPEG, WebP, or GIF images.");
      return;
    }
    startUpload(async () => {
      try {
        for (const [index, file] of images.entries()) {
          setStatus(images.length > 1 ? `Uploading ${index + 1} of ${images.length}…` : "Uploading…");
          const { width, height } = await measure(file);
          const blob = await upload(`krillion/screenshot.${EXTENSIONS[file.type]}`, file, {
            access: "public",
            handleUploadUrl: "/api/krillion/upload",
            contentType: file.type,
          });
          await addShot({ url: blob.url, width, height });
        }
        setStatus(null);
      } catch {
        setStatus("Upload failed. Try again.");
      }
    });
  }

  const onWindowDragEnter = useEffectEvent(() => setDragging(true));
  const onWindowDrop = useEffectEvent((files) => {
    setDragging(false);
    uploadFiles(files);
  });

  useEffect(() => {
    if (!owner) return;
    let depth = 0;
    const enter = (event) => {
      if (!hasFiles(event)) return;
      depth += 1;
      onWindowDragEnter();
    };
    const leave = (event) => {
      if (!hasFiles(event)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragging(false);
    };
    const over = (event) => {
      if (hasFiles(event)) event.preventDefault();
    };
    const drop = (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      depth = 0;
      onWindowDrop(event.dataTransfer.files);
    };
    const paste = (event) => {
      const files = event.clipboardData?.files;
      if (!files?.length) return;
      event.preventDefault();
      onWindowDrop(files);
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("dragover", over);
    window.addEventListener("drop", drop);
    window.addEventListener("paste", paste);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("dragover", over);
      window.removeEventListener("drop", drop);
      window.removeEventListener("paste", paste);
    };
  }, [owner]);

  function remove(id) {
    if (!window.confirm("Delete this screenshot?")) return;
    startTransition(async () => {
      hideShot(id);
      await deleteShot(id);
    });
  }

  const openShot = openIndex === null ? null : visibleShots[openIndex];

  return (
    <section aria-labelledby="favorites-heading" className="space-y-8">
      <div className="flex items-baseline gap-4 text-base sm:text-lg">
        <h2 id="favorites-heading" className="text-gray-400">
          favorite answers
        </h2>
        {owner && (
          <label
            className={`text-gray-700 hover:text-white transition-colors duration-200 ${
              busy ? "pointer-events-none" : "cursor-pointer"
            }`}
          >
            <input
              type="file"
              accept={Object.keys(EXTENSIONS).join(",")}
              multiple
              disabled={busy}
              className="sr-only"
              onChange={(event) => {
                uploadFiles(event.target.files);
                event.target.value = "";
              }}
            />
            {busy ? status : "add"}
          </label>
        )}
        {owner && !busy && status && <span className="text-gray-500">{status}</span>}
      </div>

      {owner && dragging && (
        <div className="fixed inset-4 z-40 pointer-events-none flex items-center justify-center rounded-2xl border border-dashed border-gray-500 bg-black/80 text-gray-300">
          drop to add
        </div>
      )}

      {visibleShots.length === 0 && <p className="text-gray-600">Nothing here yet.</p>}

      {visibleShots.length > 0 && (
        <ul className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {visibleShots.map((shot, index) => (
            <li key={shot.id} className="group mb-8 break-inside-avoid">
              <figure>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={shot.caption ? `Enlarge: ${shot.caption}` : "Enlarge screenshot"}
                  className="block w-full overflow-hidden rounded-lg border border-gray-900 hover:border-gray-600 transition-colors duration-200 cursor-zoom-in"
                >
                  <Image
                    src={shot.url}
                    width={shot.width}
                    height={shot.height}
                    sizes={GRID_SIZES}
                    alt={shot.caption || "Krillion answer screenshot"}
                    className="w-full h-auto"
                  />
                </button>
                {owner ? (
                  <div className="mt-2 flex items-start gap-2">
                    <CaptionInput shot={shot} />
                    <button
                      type="button"
                      onClick={() => remove(shot.id)}
                      aria-label="Delete screenshot"
                      className="mt-1 p-1 text-gray-600 hover:text-white transition duration-200 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-visible:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  shot.caption && (
                    <figcaption className="mt-2 text-gray-400 leading-relaxed">{shot.caption}</figcaption>
                  )
                )}
              </figure>
            </li>
          ))}
        </ul>
      )}

      {openShot && (
        <Lightbox
          shot={openShot}
          hasPrev={openIndex > 0}
          hasNext={openIndex < visibleShots.length - 1}
          onMove={(step) => setOpenIndex(openIndex + step)}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
}

function fitHeight(element) {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
}

function CaptionInput({ shot }) {
  function save(event) {
    const caption = event.target.value.trim();
    if (caption === shot.caption) return;
    startTransition(() => updateCaption(shot.id, caption));
  }

  return (
    <textarea
      ref={fitHeight}
      rows={1}
      defaultValue={shot.caption}
      placeholder="add a caption"
      aria-label="Caption"
      maxLength={280}
      onInput={(event) => fitHeight(event.currentTarget)}
      onBlur={save}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
      className="flex-1 min-w-0 resize-none overflow-hidden bg-transparent border-b border-transparent hover:border-gray-800 focus:border-gray-600 outline-none text-gray-400 focus:text-white placeholder:text-gray-700 pointer-fine:placeholder:text-transparent pointer-fine:group-hover:placeholder:text-gray-700 pointer-fine:focus:placeholder:text-gray-700 py-1 leading-relaxed transition-colors duration-200"
    />
  );
}

function Lightbox({ shot, hasPrev, hasNext, onMove, onClose }) {
  const closeRef = useRef(null);

  const onKey = useEffectEvent((event) => {
    if (event.key === "Escape") onClose();
    if (event.key === "ArrowLeft" && hasPrev) onMove(-1);
    if (event.key === "ArrowRight" && hasNext) onMove(1);
  });

  useEffect(() => {
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const navClass =
    "absolute top-1/2 -translate-y-1/2 p-3 text-gray-500 hover:text-white transition-colors duration-200";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.caption || "Screenshot"}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-16"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-500 hover:text-white transition-colors duration-200"
      >
        <X size={24} />
      </button>
      {hasPrev && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMove(-1);
          }}
          aria-label="Previous screenshot"
          className={`${navClass} left-1 sm:left-4`}
        >
          <ChevronLeft size={28} />
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMove(1);
          }}
          aria-label="Next screenshot"
          className={`${navClass} right-1 sm:right-4`}
        >
          <ChevronRight size={28} />
        </button>
      )}
      <Image
        key={shot.id}
        src={shot.url}
        width={shot.width}
        height={shot.height}
        sizes="100vw"
        alt={shot.caption || "Krillion answer screenshot"}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[80vh] max-w-full w-auto h-auto object-contain rounded-lg"
      />
      {shot.caption && (
        <p
          onClick={(event) => event.stopPropagation()}
          className="mt-4 max-w-2xl text-center text-gray-300 leading-relaxed"
        >
          {shot.caption}
        </p>
      )}
    </div>
  );
}
