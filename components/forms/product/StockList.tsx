import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stock_TP } from "@/types";
import { Check, Pencil, Trash, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type stockList_TP = {
  stockList: stock_TP[];
  setStockList: Dispatch<SetStateAction<stock_TP[]>>;
  error?: string;
};

const defaultStockValues: stock_TP = {
  size: "S",
  color: "#000000",
  stock: 1,
};

const StockList = ({ stockList, setStockList, error }: stockList_TP) => {
  const [values, setValues] = useState<stock_TP>(defaultStockValues);
  const [localColor, setLocalColor] = useState(values.color);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValues((prev) => ({
        ...prev,
        color: localColor,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [localColor]);

  const addStock = () => {
    setStockList((prev) => [...prev, values]);
  };

  const deleteFromStock = (stockIndex: number) => {
    setStockList((prev) => prev.filter((stock, index) => index !== stockIndex));
    if (editingIndex === stockIndex) setEditingIndex(null);
  };

  const startEdit = (index: number, currentStock: number) => {
    setEditingIndex(index);
    setEditValue(currentStock);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const saveEdit = (index: number) => {
    setStockList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, stock: editValue } : item,
      ),
    );
    setEditingIndex(null);
  };

  return (
    <div className="bg-muted/50 border p-4 flex flex-col justify-between">
      <table className="w-full capitalize">
        <thead className="border-b">
          <tr>
            <th>size</th>
            <th>color</th>
            <th>stock</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {error && (
            <tr>
              <td colSpan={4} className="text-sm text-destructive">
                {`${error}`}
              </td>
            </tr>
          )}
          {stockList.map((item, index) => {
            const isEditing = editingIndex === index;

            return (
              <tr key={index} className="border-b ">
                <td className="p-2">{item.size}</td>
                <td className="p-2">
                  <div
                    style={{ background: item.color }}
                    className={`h-5 w-5 rounded-full mx-auto`}
                  />
                </td>
                <td className="p-2">
                  {isEditing ? (
                    <Input
                      type="number"
                      min={0}
                      value={editValue}
                      onChange={(e) => setEditValue(Number(e.target.value))}
                      className="w-20 mx-auto text-center"
                      autoFocus
                    />
                  ) : (
                    item.stock
                  )}
                </td>
                <td className="flex justify-center gap-2 p-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={() => saveEdit(index)}
                        size="icon"
                        type="button">
                        <Check size={16} />
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        variant="outline"
                        size="icon"
                        type="button">
                        <X size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => startEdit(index, item.stock)}
                        variant="outline"
                        size="icon"
                        type="button">
                        <Pencil size={16} />
                      </Button>
                      <Button
                        onClick={() => deleteFromStock(index)}
                        variant="destructive"
                        size="icon"
                        type="button">
                        <Trash size={16} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-end gap-2 pt-4">
        <div className="space-y-2">
          <Label className="uppercase">Size</Label>
          <Select
            value={values.size}
            onValueChange={(value) =>
              setValues((prev) => ({
                ...prev,
                size: value as stock_TP["size"],
              }))
            }>
            <SelectTrigger className="w-full rounded-none mb-0 max-w-48">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Size</SelectLabel>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
                <SelectItem value="XXL">XXL</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="42">42</SelectItem>
                <SelectItem value="44">44</SelectItem>
                <SelectItem value="46">46</SelectItem>
                <SelectItem value="48">48</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="uppercase">Color</Label>
          <Input
            value={localColor}
            onChange={(e) => setLocalColor(e.target.value)}
            required
            type="color"
          />
        </div>
        <div className="space-y-2">
          <Label className="uppercase">Stock</Label>
          <Input
            id="id"
            name="stock"
            type="number"
            placeholder="0"
            value={values.stock}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, stock: Number(e.target.value) }))
            }
          />
        </div>
        <input
          type="hidden"
          name="variants"
          value={JSON.stringify(stockList)}
        />
        <Button
          onClick={addStock}
          className="text-sm rounded-none"
          type="button">
          Add to Stock
        </Button>
      </div>
    </div>
  );
};

export default StockList;
