interface TableProps {
  data: { label: string; value: string | number }[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <tbody>
          {data.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === data.length - 1;
            return (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50/5 rounded-lg" : "bg-white/[0.01]"
                } text-gray-600 rounded-lg`}
              >
                <td
                  className={`px-4 py-2 text-neutral-500 ${
                    isFirst ? "rounded-tl-lg" : ""
                  } ${
                    isLast ? "rounded-bl-lg" : ""
                  } ${data.length === 1 ? "rounded-l-lg" : ""}`}
                >
                  {item.label}
                </td>
                <td
                  className={`px-4 py-2 text-white float-right ${
                    isFirst ? "rounded-tr-lg" : ""
                  } ${
                    isLast ? "rounded-br-lg" : ""
                  } ${data.length === 1 ? "rounded-r-lg" : ""}`}
                >
                  {item.value}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
