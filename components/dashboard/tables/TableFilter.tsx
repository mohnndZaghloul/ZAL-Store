import { Input } from "../../ui/input";

export default function TableFilter({ table, filter }: any) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder={`Filter ${filter}...`}
        value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(filter)?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
}
