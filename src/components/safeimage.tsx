interface Props
  extends React.ImgHTMLAttributes<HTMLImageElement>
{
  fallback: string;
}

export function SaveImage(props: Props) {
  const { fallback, ...rest } = props;

  return (
    <img
      {...rest}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        target.onerror = null; // Чтобы не зациклиться
        target.src = fallback;
      }}
    />
  );
}
