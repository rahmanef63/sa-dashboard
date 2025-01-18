import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { Input } from "shared/components/ui/input";

interface PostFilterProps {
  filterBy: string;
  setFilterBy: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const PostFilter = ({ filterBy, setFilterBy, searchQuery, setSearchQuery }: PostFilterProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Filter by</label>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger>
            <SelectValue placeholder="Select filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Filter</SelectItem>
            <SelectItem value="status">By Status</SelectItem>
            <SelectItem value="platform">By Platform</SelectItem>
            <SelectItem value="title">By Title</SelectItem>
            <SelectItem value="date">By Date</SelectItem>
            <SelectItem value="responsible">By Responsible User</SelectItem>
            <SelectItem value="contentPillar">By Content Pillar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Search</label>
        <Input
          placeholder={`Search by ${filterBy}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          disabled={filterBy === "none"}
        />
      </div>
    </div>
  );
};