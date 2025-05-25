// Component: app/pref-list-generator/_components/PreferenceForm.jsx

"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Static Data & Branch Clusters ---
const placesList = ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Navi Mumbai", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Shirgaon", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal", "solapur"];
const categoriesList = ['General', 'OBC', 'EWS', 'VJ', 'NT', 'DT', 'SC', 'ST', 'TFWS'];
// This is the complete list of all unique branches.
const allBranchesList = [
    "5G", "Aeronautical Engineering", "Agricultural Engineering", "Artificial Intelligence",
    "Architectural Assistantship", "Technical Textiles",
    "Artificial Intelligence (AI) and Data Science", "Artificial Intelligence and Data Science",
    "Artificial Intelligence and Machine Learning", "Automation and Robotics", "Automobile Engineering",
    "Bio Medical Engineering", "Bio Technology", "Chemical Engineering", "Civil Engineering",
    "Civil Engineering and Planning", "Civil and Environmental Engineering", "Civil and infrastructure Engineering",
    "Computer Engineering", "Computer Engineering (Software Engineering)", "Computer Science",
    "Computer Science and Business Systems", "Computer Science and Design", "Computer Science and Engineering",
    "Computer Science and Engineering (Artificial Intelligence and Data Science)",
    "Computer Science and Engineering (Artificial Intelligence)",
    "Computer Science and Engineering (Cyber Security)",
    "Computer Science and Engineering (Internet of Things and Cyber Security Including Block Chain Technology)",
    "Computer Science and Engineering (IoT)",
    "Computer Science and Engineering(Artificial Intelligence and Machine Learning)",
    "Computer Science and Engineering(Cyber Security)", "Computer Science and Engineering(Data Science)",
    "Computer Science and Information Technology", "Computer Science and Technology", "Computer Technology",
    "Cyber Security", "Data Engineering", "Data Science", "Dyestuff Technology",
    "Electrical Engg [Electrical and Power]", "Electrical Engg[Electronics and Power]", "Electrical Engineering",
    "Electrical and Computer Engineering", "Electrical and Electronics Engineering", "Electronics Engineering",
    "Electronics Engineering ( VLSI Design and Technology)", "Electronics and Biomedical Engineering",
    "Electronics and Communication (Advanced Communication Technology)", "Electronics and Communication Engineering",
    "Electronics and Communication(Advanced Communication Technology)", "Electronics and Computer Engineering",
    "Electronics and Computer Science", "Electronics and Telecommunication Engg", "Fashion Technology",
    "Fibres and Textile Processing Technology", "Food Engineering and Technology", "Food Technology",
    "Food Technology And Management", "Industrial IoT", "Information Technology", "Instrumentation Engineering",
    "Instrumentation and Control Engineering", "Internet of Things (IoT)", "Logistics",
    "Man Made Textile Technology", "Manufacturing Science and Engineering", "Mechanical & Automation Engineering",
    "Mechanical Engineering", "Mechanical Engineering[Sandwich]",
    "Mechanical and Mechatronics Engineering (Additive Manufacturing)", "Mechatronics Engineering",
    "Metallurgy and Material Technology", "Mining Engineering", "Oil Fats and Waxes Technology",
    "Oil Technology", "Oil and Paints Technology", "Oil,Oleochemicals and Surfactants Technology",
    "Paints Technology", "Paper and Pulp Technology", "Petro Chemical Engineering", "Petro Chemical Technology",
    "Pharmaceutical and Fine Chemical Technology", "Pharmaceuticals Chemistry and Technology",
    "Plastic Technology", "Plastic and Polymer Engineering", "Plastic and Polymer Technology",
    "Polymer Engineering and Technology", "Printing Technology", "Production Engineering",
    "Production Engineering[Sandwich]", "Robotics and Artificial Intelligence", "Robotics and Automation",
    "Safety and Fire Engineering", "Structural Engineering", "Surface Coating Technology",
    "Textile Chemistry", "Textile Engineering / Technology", "Textile Plant Engineering",
    "Textile Technology", "VLSI"].sort((a, b) => a.localeCompare(b));

const branchClusterMap = {
    "Computer & IT": ["Computer Engineering", "Computer Engineering (Software Engineering)", "Computer Science", "Computer Science and Business Systems", "Computer Science and Design", "Computer Science and Engineering", "Computer Science and Information Technology", "Computer Science and Technology", "Computer Technology", "Information Technology"],
    "AI/ML/DS": ["Artificial Intelligence", "Artificial Intelligence (AI) and Data Science", "Artificial Intelligence and Data Science", "Artificial Intelligence and Machine Learning", "Computer Science and Engineering (Artificial Intelligence and Data Science)", "Computer Science and Engineering (Artificial Intelligence)", "Computer Science and Engineering(Artificial Intelligence and Machine Learning)", "Computer Science and Engineering(Data Science)", "Data Engineering", "Data Science", "Robotics and Artificial Intelligence"],
    "Cybersecurity & IoT": ["Computer Science and Engineering (Cyber Security)", "Computer Science and Engineering (Internet of Things and Cyber Security Including Block Chain Technology)", "Computer Science and Engineering (IoT)", "Computer Science and Engineering(Cyber Security)", "Cyber Security", "Industrial IoT", "Internet of Things (IoT)"],
    "Electronics & TeleComm": ["5G", "Electrical and Computer Engineering", "Electrical and Electronics Engineering", "Electronics Engineering", "Electronics Engineering ( VLSI Design and Technology)", "Electronics and Communication (Advanced Communication Technology)", "Electronics and Communication Engineering", "Electronics and Communication(Advanced Communication Technology)", "Electronics and Computer Engineering", "Electronics and Computer Science", "Electronics and Telecommunication Engg", "VLSI"],
    "Electrical": ["Electrical Engg [Electrical and Power]", "Electrical Engg[Electronics and Power]", "Electrical Engineering"],
    "Mechanical & Automation": ["Automation and Robotics", "Robotics and Artificial Intelligence", "Automobile Engineering", "Manufacturing Science and Engineering", "Mechanical & Automation Engineering", "Mechanical Engineering", "Mechanical Engineering[Sandwich]", "Mechanical and Mechatronics Engineering (Additive Manufacturing)", "Mechatronics Engineering", "Production Engineering", "Production Engineering[Sandwich]", "Robotics and Automation"],
    "Civil": ["Civil Engineering", "Architectural Assistantship", "Civil Engineering and Planning", "Civil and Environmental Engineering", "Civil and infrastructure Engineering", "Structural Engineering"],
    "Chemical & Allied": ["Chemical Engineering", "Dyestuff Technology", "Fibres and Textile Processing Technology", "Oil Fats and Waxes Technology", "Oil Technology", "Oil and Paints Technology", "Oil,Oleochemicals and Surfactants Technology", "Paints Technology", "Paper and Pulp Technology", "Petro Chemical Engineering", "Petro Chemical Technology", "Pharmaceutical and Fine Chemical Technology", "Pharmaceuticals Chemistry and Technology", "Plastic Technology", "Plastic and Polymer Engineering", "Plastic and Polymer Technology", "Polymer Engineering and Technology", "Surface Coating Technology", "Textile Chemistry"],
    "Textile Engineering": [ // Separated Textile
        "Textile Chemistry",
        "Man Made Textile Technology",
        "Textile Engineering / Technology",
        "Textile Plant Engineering",
        "Textile Technology",
        "Fibres and Textile Processing Technology",
        "Technical Textiles"
    ],
    "Aeronautical Engineering": [ // New Cluster
        "Aeronautical Engineering"
      ],
    "Agriculture & Biotechnology": [ // New Cluster
        "Bio Medical Engineering",
        "Agricultural Engineering",
        "Bio Technology",
        "Electronics and Biomedical Engineering" // Already in Electronics, user can pick one or both clusters
    ],
    "Food & Fashion Tech": [ // New Cluster
        "Fashion Technology",
        "Food Engineering and Technology",
        "Food Technology",
        "Food Technology And Management"
    ],
    "Instrumentation & Control": [ // New Cluster
        "Instrumentation Engineering",
        "Instrumentation and Control Engineering"
    ],
    "Materials & Mining": [ // New Cluster
        "Metallurgy and Material Technology",
        "Mining Engineering"
    ],
    "Industrial & Other Specialized": [ // New Cluster for remaining
        "Logistics",
        "Printing Technology",
        "Safety and Fire Engineering"
    ]}; // Ensure this map is complete
const clusterNames = Object.keys(branchClusterMap);

// --- MultiSelect Component (Keep as is) ---
function MultiSelect({
  label, placeholder, options, selectedValues, onSelectionChange, name, disabled,
  displayKey = (option) => option, valueKey = (option) => option
}) {
    const [open, setOpen] = useState(false);

    const handleSelect = useCallback((option) => {
        const optionValue = valueKey(option);
        const isSelected = selectedValues.includes(optionValue);
        const newSelection = isSelected
            ? selectedValues.filter((item) => item !== optionValue)
            : [...selectedValues, optionValue];
        onSelectionChange(name, newSelection);
    }, [selectedValues, onSelectionChange, name, valueKey]);

    const handleBadgeRemove = (optionValue) => {
        const newSelection = selectedValues.filter((item) => item !== optionValue);
        onSelectionChange(name, newSelection);
    }

    const getSelectedOptionDisplay = (value) => {
        const foundOption = options.find(opt => valueKey(opt) === value);
        return foundOption ? displayKey(foundOption) : value;
    }

    return (
        <div className="space-y-2">
            <Label className={cn("font-semibold block", disabled && "text-gray-400")}>{label}</Label>
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
                                    {getSelectedOptionDisplay(value)}
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
                                    const optionValue = valueKey(option);
                                    const isSelected = selectedValues.includes(optionValue);
                                    return (
                                        <CommandItem
                                            key={optionValue}
                                            value={displayKey(option)}
                                            onSelect={() => handleSelect(option)}
                                            className="flex justify-between items-center cursor-pointer"
                                        >
                                            <span>{displayKey(option)}</span>
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
export default function PreferenceForm({ onResult, setLoading, setError, isLoading }) {
  const [formData, setFormData] = useState({
    percentile: '',
    category: 'General',
    selectedClusters: [],
    selectedIndividualBranches: [],
    places: [],
  });
  const router = useRouter();

  // --- State for Auth Check ---
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  // --- End Auth State ---

  // Define Backend API URL
  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://college-website-backend-main-z0vm.onrender.com";

  // --- Fetch user status on component mount ---
  useEffect(() => {
    const fetchUserStatus = async () => {
        setIsLoadingUser(true);
        const profileUrl = `${baseApiUrl}/apiv1/users/getUserProfile`;
        console.log("[PreferenceForm] Fetching user status from:", profileUrl); // Log URL

        try {
            const response = await axios.get(profileUrl, {
                withCredentials: true, // Send cookies
            });
            console.log("[PreferenceForm] User profile response status:", response.status); // Log status
            console.log("[PreferenceForm] User profile response data:", response.data); // Log raw data
            if (response.data && response.data.success && response.data.user) {
                setUser(response.data.user);
                console.log("[PreferenceForm] User authenticated:", response.data.user.email); // Log user email
            } else {
                setUser(null);
                console.log("[PreferenceForm] User not authenticated or response format incorrect.");
            }
        } catch (error) {
            console.error("[PreferenceForm] Failed to fetch user status. Error:", error.response?.data || error.message); // Log specific error
            if(error.response) {
              console.error("[PreferenceForm] Error status:", error.response.status); // Log error status
            }
            setUser(null);
        } finally {
            setIsLoadingUser(false);
            console.log("[PreferenceForm] Finished fetching user status. isLoadingUser:", false); // Log loading state change
        }
    };
    fetchUserStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount
  // --- End Fetch User Status ---


  const handleValueChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectionChange = (name, values) => {
    setFormData((prev) => ({ ...prev, [name]: values }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[PreferenceForm] handleSubmit triggered."); // Log submit start
    setError(null);
    onResult(null);

    // --- Initial Auth Check ---
    console.log("[PreferenceForm] Checking auth state. isLoadingUser:", isLoadingUser); // Log auth check start
    if (isLoadingUser) {
        console.log("[PreferenceForm] Auth check pending, showing loading toast.");
        toast.loading("Checking authentication...");
        return;
    }
    const isAuthenticated = !!user; // Check based on fetched user state
    console.log("[PreferenceForm] Authentication status:", isAuthenticated); // Log auth status
    if (!isAuthenticated) {
        console.log("[PreferenceForm] User not authenticated, redirecting to login.");
        toast.error('Authentication required. Please log in to generate the list.');
        router.push('/auth/login'); // Redirect to login
        return;
    }
    // --- End Auth Check ---


    // --- Validation ---
    console.log("[PreferenceForm] Performing form validation."); // Log validation start
    const percentileNum = parseFloat(formData.percentile);
    if (isNaN(percentileNum) || percentileNum < 0 || percentileNum > 100) {
      console.log("[PreferenceForm] Validation failed: Invalid percentile.");
      toast.error('Please enter a valid percentile between 0 and 100.'); return;
    }
    if (formData.selectedClusters.length === 0 && formData.selectedIndividualBranches.length === 0) {
      console.log("[PreferenceForm] Validation failed: No branches or clusters selected.");
      toast.error('Please select at least one branch cluster or individual branch.'); return;
    }
    if (formData.places.length === 0) {
        console.log("[PreferenceForm] Validation failed: No places selected.");
        toast.error('Please select at least one place.'); return;
    }
    console.log("[PreferenceForm] Validation passed."); // Log validation success

    setLoading(true);
    const loadingToastId = toast.loading('Generating preference list...');
    console.log("[PreferenceForm] Set loading state to true."); // Log loading start

    // --- Call Backend Wrapper API ---
    const backendApiUrl = `${baseApiUrl}/apiv1/tools/generate-preference-list`;
    const requestBody = {
        percentile: percentileNum,
        category: formData.category,
        selectedClusters: formData.selectedClusters,
        selectedIndividualBranches: formData.selectedIndividualBranches,
        places: formData.places
    };
    console.log("[PreferenceForm] Calling backend API:", backendApiUrl); // Log API URL
    console.log("[PreferenceForm] Request body:", JSON.stringify(requestBody, null, 2)); // Log request body

    try {
      const response = await fetch(backendApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include' // Send cookies
      });

      console.log("[PreferenceForm] Received response status:", response.status); // Log response status
      // Try to clone the response to read JSON without consuming the body for potential re-read
      const responseClone = response.clone();
      let result;
      try {
           result = await response.json();
           console.log("[PreferenceForm] Parsed response JSON:", result); // Log parsed JSON
      } catch (jsonError) {
           console.error("[PreferenceForm] Error parsing JSON response:", jsonError);
           // Try reading as text if JSON fails
           const textResponse = await responseClone.text();
           console.error("[PreferenceForm] Raw text response:", textResponse);
           throw new Error("Failed to parse server response."); // Throw a generic error
      }


      if (!response.ok) {
        const errorMsg = result?.message || `Request failed with status ${response.status}`;
        console.error("[PreferenceForm] Backend API Error:", errorMsg, "Status:", response.status);
        toast.error(`Error: ${errorMsg}`, { id: loadingToastId });
        setError(`Failed to generate list: ${errorMsg}`);
        onResult(null);
      } else {
        // Success
        console.log("[PreferenceForm] API call successful. Result data:", result?.data); // Log success data
        toast.success('Preference list generated!', { id: loadingToastId });
        onResult(result.data);
      }

    } catch (err) {
      // Handle network errors or errors thrown above (like JSON parsing)
      console.error("[PreferenceForm] Error during fetch or processing:", err); // Log the caught error
      const errorMsg = err.message || 'An unknown network error occurred.';
      toast.error(`Error: ${errorMsg}`, { id: loadingToastId });
      setError(`Error generating list: ${errorMsg}`);
      onResult(null);
    } finally {
      setLoading(false);
      console.log("[PreferenceForm] Set loading state to false."); // Log loading end
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Percentile Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="percentile" className={cn("font-semibold", isLoading && "text-gray-400")}>MHT-CET Percentile*</Label>
          <Input
            id="percentile" type="number" name="percentile" min="0" max="100" step="any"
            value={formData.percentile} onChange={(e) => handleValueChange('percentile', e.target.value)}
            placeholder="e.g., 95.67" required disabled={isLoading || isLoadingUser} // Disable if loading anything
            className="border-gray-300 focus:border-black focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        {/* Category Select */}
        <div className="space-y-2">
          <Label htmlFor="category" className={cn("font-semibold", isLoading && "text-gray-400")}>Category*</Label>
          <Select name="category" value={formData.category} onValueChange={(value) => handleValueChange('category', value)} disabled={isLoading || isLoadingUser}>
            <SelectTrigger id="category" className="w-full border-gray-300 focus:border-black focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Select your category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesList.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cluster MultiSelect */}
      <MultiSelect
        label="Select Branch Clusters [Optional]"
        placeholder="Select clusters..."
        options={clusterNames}
        selectedValues={formData.selectedClusters}
        onSelectionChange={handleMultiSelectionChange}
        name="selectedClusters"
        disabled={isLoading || isLoadingUser}
      />

      {/* Individual Branches MultiSelect */}
      <MultiSelect
        label="Select Individual Branches"
        placeholder="Select specific branches..."
        options={allBranchesList}
        selectedValues={formData.selectedIndividualBranches}
        onSelectionChange={handleMultiSelectionChange}
        name="selectedIndividualBranches"
        disabled={isLoading || isLoadingUser}
      />

      {/* Places MultiSelect */}
      <MultiSelect
        label="Preferred Places*"
        placeholder="Select places..."
        options={placesList}
        selectedValues={formData.places}
        onSelectionChange={handleMultiSelectionChange}
        name="places"
        disabled={isLoading || isLoadingUser}
      />

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full md:w-auto bg-black text-white hover:bg-gray-800 px-8 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
          // Disable button if loading the form submission OR if initially loading user status
          disabled={isLoading || isLoadingUser}
        >
          {/* Show loading state based on form submission or initial user load */}
          {isLoading ? (
            <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating... </>
          ) : isLoadingUser ? (
             <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking Auth... </>
          ) : (
            'Generate Preference List'
          )}
        </Button>
      </div>
    </form>
  );
}