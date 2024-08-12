"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const sortBy = ["Deadline", "Priority", "Date Created"];

interface Props {
  sort: { key: string; direction: "Ascending" | "Descending" };
  setSort: React.Dispatch<React.SetStateAction<{ key: string; direction: "Ascending" | "Descending" }>>;
}

export const SortByDropdown: React.FC<Props> = ({ sort, setSort }) => {
  function onSortChange(direction: string) {
    localStorage.setItem("sortPreference", direction);
    setSort((curr) => ({ key: curr.key, direction: direction as "Ascending" | "Descending" }));
  }

  function SortKeyDropdown() {
    return (
      <DropdownMenu>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-base">Sort By</p>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{sort.key}</Button>
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent className="pr-4">
          <DropdownMenuRadioGroup value={sort.direction} onValueChange={(val) => setSort((curr) => ({ key: val, direction: curr.direction }))}>
            {sortBy.map((sort, index) => (
              <DropdownMenuRadioItem key={sort} value={sort}>
                {sort}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function DirectionRadioGroup() {
    return (
      <RadioGroup onValueChange={(dir: string) => onSortChange(dir)} defaultValue={sort.direction}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Ascending" id="r1" />
          <Label htmlFor="r1">Ascending</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Descending" id="r2" />
          <Label htmlFor="r2">Descending</Label>
        </div>
      </RadioGroup>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap ">
      <SortKeyDropdown />
      <DirectionRadioGroup />
    </div>
  );
};
