// Component: app/pref-list-generator/_components/PreferenceForm.jsx

"use client";

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card'; // Optional: Wrap form in a card
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react"; // Added Loader2 Icon
import { cn } from "@/lib/utils"; // Assuming you have clsx/tailwind-merge setup from shadcn

// --- Static Data ---
const placesList = ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Navi Mumbai", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Shirgaon", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal", "solapur"];
const branchesList = ["5G", "Aeronautical Engineering", "Agricultural Engineering", "Artificial Intelligence", "Artificial Intelligence (AI) and Data Science", "Artificial Intelligence and Data Science", "Artificial Intelligence and Machine Learning", "Automation and Robotics", "Automobile Engineering", "Bio Medical Engineering", "Bio Technology", "Chemical Engineering", "Civil Engineering", "Civil Engineering and Planning", "Civil and Environmental Engineering", "Civil and infrastructure Engineering", "Computer Engineering", "Computer Engineering (Software Engineering)", "Computer Science", "Computer Science and Business Systems", "Computer Science and Design", "Computer Science and Engineering", "Computer Science and Engineering (Artificial Intelligence and Data Science)", "Computer Science and Engineering (Artificial Intelligence)", "Computer Science and Engineering (Cyber Security)", "Computer Science and Engineering (Internet of Things and Cyber Security Including Block Chain Technology)", "Computer Science and Engineering (IoT)", "Computer Science and Engineering(Artificial Intelligence and Machine Learning)", "Computer Science and Engineering(Cyber Security)", "Computer Science and Engineering(Data Science)", "Computer Science and Information Technology", "Computer Science and Technology", "Computer Technology", "Cyber Security", "Data Engineering", "Data Science", "Dyestuff Technology", "Electrical Engg [Electrical and Power]", "Electrical Engg[Electronics and Power]", "Electrical Engineering", "Electrical and Computer Engineering", "Electrical and Electronics Engineering", "Electronics Engineering", "Electronics Engineering ( VLSI Design and Technology)", "Electronics and Biomedical Engineering", "Electronics and Communication (Advanced Communication Technology)", "Electronics and Communication Engineering", "Electronics and Communication(Advanced Communication Technology)", "Electronics and Computer Engineering", "Electronics and Computer Science", "Electronics and Telecommunication Engg", "Fashion Technology", "Fibres and Textile Processing Technology", "Food Engineering and Technology", "Food Technology", "Food Technology And Management", "Industrial IoT", "Information Technology", "Instrumentation Engineering", "Instrumentation and Control Engineering", "Internet of Things (IoT)", "Logistics", "Man Made Textile Technology", "Manufacturing Science and Engineering", "Mechanical & Automation Engineering", "Mechanical Engineering", "Mechanical Engineering[Sandwich]", "Mechanical and Mechatronics Engineering (Additive Manufacturing)", "Mechatronics Engineering", "Metallurgy and Material Technology", "Mining Engineering", "Oil Fats and Waxes Technology", "Oil Technology", "Oil and Paints Technology", "Oil,Oleochemicals and Surfactants Technology", "Paints Technology", "Paper and Pulp Technology", "Petro Chemical Engineering", "Petro Chemical Technology", "Pharmaceutical and Fine Chemical Technology", "Pharmaceuticals Chemistry and Technology", "Plastic Technology", "Plastic and Polymer Engineering", "Plastic and Polymer Technology", "Polymer Engineering and Technology", "Printing Technology", "Production Engineering", "Production Engineering[Sandwich]", "Robotics and Artificial Intelligence", "Robotics and Automation", "Safety and Fire Engineering", "Structural Engineering", "Surface Coating Technology", "Textile Chemistry", "Textile Engineering / Technology", "Textile Plant Engineering", "Textile Technology", "VLSI"];
const categoriesList = ['General', 'OBC', 'EWS', 'VJ', 'NT', 'DT', 'SC', 'ST', 'TFWS'];

// --- MultiSelect Component ---
function MultiSelect({ label, placeholder, options, selectedValues, onSelectionChange, name, disabled }) {
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback((optionValue) => {
    const isSelected = selectedValues.includes(optionValue);
    const newSelection = isSelected
      ? selectedValues.filter((item) => item !== optionValue)
      : [...selectedValues, optionValue];
    onSelectionChange(name, newSelection);
  }, [selectedValues, onSelectionChange, name]);

  const handleBadgeRemove = (optionValue) => {
     const newSelection = selectedValues.filter((item) => item !== optionValue);
     onSelectionChange(name, newSelection);
  }

  return (
    <div className="space-y-2">
       <Label className={cn("font-semibold block", disabled && "text-gray-400")}>{label}*</Label>
       <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline" role="combobox" aria-expanded={open} disabled={disabled}
            className={cn("w-full justify-between border-gray-300 text-gray-500 hover:text-gray-700 font-normal h-10", disabled && "cursor-not-allowed opacity-50")}
          >
            {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
         <div className="pt-1 min-h-[24px]">
             {selectedValues.length > 0 && (
                 <div className="flex gap-1 flex-wrap">
                     {selectedValues.map((value) => (
                         <Badge key={value} variant="secondary" className="rounded-sm px-2 py-0.5 font-normal">
                             {value}
                             <button
                                type="button" disabled={disabled}
                                onClick={(e) => { e.stopPropagation(); handleBadgeRemove(value); }}
                                className={cn("ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2", disabled && "cursor-not-allowed")}
                                onKeyDown={(e) => { if (e.key === "Enter") handleBadgeRemove(value); }}
                                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                             > <X className={cn("h-3 w-3 text-muted-foreground", !disabled && "hover:text-foreground")} /> </button>
                         </Badge>
                     ))}
                 </div>
             )}
         </div>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <CommandItem key={option} value={option} onSelect={() => handleSelect(option)} className="flex justify-between items-center cursor-pointer">
                      <span>{option}</span>
                      <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// --- Main Preference Form Component ---
// Accept isLoading prop
export default function PreferenceForm({ onResult, setLoading, setError, isLoading }) {
  const [formData, setFormData] = useState({
    percentile: '', category: 'General', branches: [], places: [],
  });

  const handleValueChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectionChange = (name, values) => {
     setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- Validation ---
    const percentileNum = parseFloat(formData.percentile);
    if (isNaN(percentileNum) || percentileNum < 0 || percentileNum > 100) {
      toast.error('Please enter a valid percentile between 0 and 100.'); return;
    }
    if (formData.branches.length === 0) { toast.error('Please select at least one branch.'); return; }
    if (formData.places.length === 0) { toast.error('Please select at least one place.'); return; }

    setLoading(true); // Use parent's setLoading
    onResult(null);

    // --- Prepare Query Params ---
    const queryParams = new URLSearchParams({
      percentile: formData.percentile, category: formData.category,
    });
    formData.branches.forEach((b) => queryParams.append('branches', b));
    formData.places.forEach((p) => queryParams.append('places', p));

    const apiUrl = `https://pref-list-new.onrender.com/preference-list?${queryParams.toString()}`;
    console.log("Fetching:", apiUrl);

    try {
      const loadingToastId = toast.loading('Fetching preference list...');
      const res = await fetch(apiUrl);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      toast.success('Preference list generated!', { id: loadingToastId });
      onResult(data);
    } catch (err) {
      console.error("Error fetching preference list:", err);
      const errorMsg = err.message || 'An unknown error occurred.';
      toast.error(`Error: ${errorMsg}`);
      setError(`Error fetching preference list: ${errorMsg}`);
      onResult(null);
    } finally {
      setLoading(false); // Use parent's setLoading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Percentile Input */}
        <div className="space-y-2">
          <Label htmlFor="percentile" className={cn("font-semibold", isLoading && "text-gray-400")}>MHT-CET Percentile*</Label>
          <Input
            id="percentile" type="number" name="percentile" min="0" max="100" step="0.01"
            value={formData.percentile} onChange={(e) => handleValueChange('percentile', e.target.value)}
            placeholder="e.g., 95.67" required disabled={isLoading}
            className="border-gray-300 focus:border-black focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <Label htmlFor="category" className={cn("font-semibold", isLoading && "text-gray-400")}>Category*</Label>
          <Select name="category" value={formData.category} onValueChange={(value) => handleValueChange('category', value)} disabled={isLoading}>
            <SelectTrigger id="category" className="w-full border-gray-300 focus:border-black focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Select your category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesList.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Branches MultiSelect Dropdown */}
      <MultiSelect
        label="Preferred Branches" placeholder="Select branches..." options={branchesList}
        selectedValues={formData.branches} onSelectionChange={handleMultiSelectionChange}
        name="branches" disabled={isLoading}
      />

      {/* Places MultiSelect Dropdown */}
       <MultiSelect
        label="Preferred Places" placeholder="Select places..." options={placesList}
        selectedValues={formData.places} onSelectionChange={handleMultiSelectionChange}
        name="places" disabled={isLoading}
      />

      {/* Submit Button */}
      <div className="pt-4">
         <Button
            type="submit"
            className="w-full md:w-auto bg-black text-white hover:bg-gray-800 px-8 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
            // --- CRITICAL: Use the isLoading prop directly ---
            disabled={isLoading}
         >
          {isLoading ? ( // Show loading state on button
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Preference List'
          )}
         </Button>
      </div>
    </form>
  );
}
