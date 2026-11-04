import { getImageProps } from "next/image";

export function ProjectShot({
  name,
  alt,
  priority = false,
}: {
  name: string;
  alt: string;
  priority?: boolean;
}) {
  const common = { alt, priority, quality: 80 };
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    src: `/images/work/${name}.png`,
    width: 1440,
    height: 900,
    sizes: "(min-width: 1024px) 60vw, 92vw",
  });
  const {
    props: { srcSet: phone, ...img },
  } = getImageProps({
    ...common,
    src: `/images/work/mobile/${name}.jpg`,
    width: 780,
    height: 1114,
    sizes: "100vw",
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} />
      <source srcSet={phone} />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        {...img}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    </picture>
  );
}
