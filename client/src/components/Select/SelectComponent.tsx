import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type DropdownProps = {
    items: string[];
    label: string;
    onChange?: (value: string) => void;
    value?: string;
};

export default function SelectCategory({
    items,
    label,
    onChange,
    value,
}: DropdownProps) {
    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="w-full">
                <SelectValue
                    placeholder={`Select a ${label.toLocaleLowerCase()}`}
                />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {items.map((item) => (
                        <SelectItem value={item}>{item}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
