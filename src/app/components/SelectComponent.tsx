"use client";
import { Select, SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";

export default function SelectComponent(props: any) {
  const { selectArguments, handleOnValueChange } = props;

  return (
    <Select
      onValueChange={(value: any) => {
        if (handleOnValueChange) {
          handleOnValueChange(value); // Call the parent handler
        }
      }}
      defaultValue={selectArguments.defaultValue}
      required
    >
      <SelectTrigger className="w-[100%] text-lg py-3">
        <SelectValue placeholder={selectArguments.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {selectArguments.values?.map((val: any, idx: any) => (
          <SelectItem key={idx} value={val.toString()}>
            {val}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
