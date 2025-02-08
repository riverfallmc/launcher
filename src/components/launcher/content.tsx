function Content(
  props: {children?: React.ReactNode}
) {
  return <div {...props} className="flex-1 max-h-full overflow-y-auto px-24 py-8" />
}

export default Content;