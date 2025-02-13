function Content(
  props: {children?: React.ReactNode}
) {
  return <div {...props} className="flex-1 max-h-full overflow-y-auto px-24 p-10" />
}

export default Content;
