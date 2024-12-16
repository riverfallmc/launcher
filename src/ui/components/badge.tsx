function Badge({color, textColor, children}: {color?: string, textColor?: string, children: React.ReactNode}) {
  return <div
    className="py-0.5 px-1 text-xs font-medium rounded-md uppercase"
    style={{
      backgroundColor: color,
      color: textColor
    }}>{children}</div>
}

export default Badge;