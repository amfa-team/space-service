import type { ISpace } from "@amfa-team/space-service-types";
import type { SyntheticEvent } from "react";
import React, { useCallback, useEffect, useState } from "react";
import type { SpaceUpdateData } from "../../../api/useApi";
import { useSpaceUpdate } from "../../../api/useApi";

interface SpaceCreateProps {
  space: Partial<ISpace>;
  onChanged: () => void;
}

export function SpaceCreate(props: SpaceCreateProps) {
  const { space, onChanged } = props;
  const [slug, setSlug] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [data, setData] = useState<SpaceUpdateData | null>(null);
  const { update, validate } = useSpaceUpdate();

  const reset = useCallback(() => {
    setSlug(space._id ?? "");
    setName(space.name ?? "");
    setImageUrl(space.imageUrl ?? "");
    setEnabled(space.enabled ?? true);
    setFilePreview("");
  }, [space]);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setFilePreview(preview);

      return () => {
        URL.revokeObjectURL(preview);
      };
    }

    return () => {
      // no-op
    };
  }, [file]);

  useEffect(() => {
    setData({ slug, name, enabled, image: file ?? imageUrl });
  }, [slug, name, enabled, file, imageUrl]);

  const onSlugChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSlug(e.target.value);
    },
    [],
  );

  const onNameChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [],
  );

  const onEnabledChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEnabled(e.target.checked ?? false);
    },
    [],
  );

  const onFileChange = useCallback((e) => {
    const files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    setFile(files[0] ?? null);
  }, []);

  const submit = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      update(data)
        .then(onChanged)
        // eslint-disable-next-line no-console
        .catch(console.error);
    },
    [update, data, onChanged],
  );

  return (
    <div>
      <p>Create/Update Space</p>
      <form onSubmit={submit}>
        <div>
          <label>
            Slug:
            <input
              type="text"
              value={slug}
              size={50}
              onChange={onSlugChanged}
              required
              minLength={3}
            />
          </label>
        </div>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              size={50}
              onChange={onNameChanged}
              required
              minLength={3}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={onEnabledChanged}
            />
            Enabled
          </label>
        </div>
        {imageUrl && (
          <div>
            <p>Previous: </p>
            <img height={200} alt="previous" src={imageUrl} />
          </div>
        )}
        {filePreview && (
          <div>
            <p>Preview: </p>
            <img height={200} alt="preview" src={filePreview} />
          </div>
        )}
        <div>
          <p>Select an image</p>
          <input type="file" onChange={onFileChange} accept="image/*" />
        </div>
        <button type="submit" disabled={!validate(data)}>
          Submit
        </button>
      </form>
    </div>
  );
}
