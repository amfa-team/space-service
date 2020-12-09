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
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [data, setData] = useState<SpaceUpdateData>({
    slug: space._id ?? "",
    name: space.name ?? "",
    enabled: space.enabled ?? false,
    home: space.home ?? false,
    random: space.random ?? false,
    order: space.order ?? 0,
    image: space.imageUrl ?? null,
  });
  const { update, validate } = useSpaceUpdate();

  const reset = useCallback(() => {
    setFile(null);
    setData({
      slug: space._id ?? "",
      name: space.name ?? "",
      enabled: space.enabled ?? false,
      home: space.home ?? false,
      random: space.random ?? false,
      order: space.order ?? 0,
      image: space.imageUrl ?? null,
    });
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

    setFilePreview("");

    return () => {
      // no-op
    };
  }, [file]);

  useEffect(() => {
    setData((d) => ({ ...d, image: file }));
  }, [file]);

  const onSlugChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const slug = e.target.value;
      setData((d) => ({ ...d, slug }));
    },
    [],
  );

  const onNameChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      setData((d) => ({ ...d, name }));
    },
    [],
  );

  const onEnabledChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const enabled = e.target.checked ?? false;
      setData((d) => ({ ...d, enabled }));
    },
    [],
  );

  const onRandomChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const random = e.target.checked ?? false;
      setData((d) => ({ ...d, random }));
    },
    [],
  );

  const onHomeChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const home = e.target.checked ?? false;
      setData((d) => ({ ...d, home }));
    },
    [],
  );

  const onOrderChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const order = Number(e.target.value);
      setData((d) => ({ ...d, order }));
    },
    [],
  );

  const onFileChange = useCallback((e) => {
    const files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    setFile(files[0] ?? null);
  }, []);

  const removeImage = useCallback(() => {
    setFile(null);
    setData((d) => ({ ...d, image: null }));
  }, []);

  const imagePreview = data.image instanceof File ? filePreview : data.image;

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
              value={data.slug}
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
              value={data.name}
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
              checked={data.enabled}
              onChange={onEnabledChanged}
            />
            Enabled
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={data.random}
              onChange={onRandomChanged}
            />
            Random
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={data.home}
              onChange={onHomeChanged}
            />
            Home
          </label>
        </div>
        <div>
          <label>
            <input type="number" value={data.order} onChange={onOrderChanged} />
            Order
          </label>
        </div>
        {space.imageUrl && (
          <div>
            <p>Previous: </p>
            <img height={200} alt="previous" src={space.imageUrl} />
          </div>
        )}
        {imagePreview && (
          <div>
            <p>Preview: </p>
            <img height={200} alt="preview" src={imagePreview} />
          </div>
        )}
        <div>
          <p>Select an image</p>
          <input type="file" onChange={onFileChange} accept="image/jpeg" />
          <button type="button" onClick={removeImage}>
            Remove image
          </button>
        </div>
        <button type="submit" disabled={!validate(data)}>
          Submit
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </form>
    </div>
  );
}
