import { useState, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Camera, MapPin, Tag, Upload, Navigation } from "lucide-react";
import { GoogleInteractiveMap } from "./GoogleInteractiveMap";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export function ReportForm({ onBack }: { onBack?: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Infrastructure");
  const [location, setLocation] = useState({ 
    lat: 15.4909, 
    lng: 73.8278, 
    address: "",
    area: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);


  const categories = [
    "Infrastructure",
    "Safety", 
    "Environment",
    "Transportation",
    "Public Services",
    "Utilities",
    "Parks & Recreation"
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
            area: "",
            city: "",
            state: "",
            pincode: ""
          };
          setLocation(newLocation);
          toast.success("Location captured successfully!");
        },
        (error) => {
          toast.error("Failed to get location. Please enable location access.");
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleLocationSelect = (selectedLoc: { lat: number; lng: number }) => {
    setLocation({
      ...location,
      lat: selectedLoc.lat,
      lng: selectedLoc.lng,
    });
    toast.success('Location selected on map');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to submit a report");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrl = null;

      // Upload image if selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('report-images')
          .upload(fileName, selectedImage);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('report-images')
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      }

      // Insert report
      const { error } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          title,
          description,
          category,
          latitude: location.lat,
          longitude: location.lng,
          address: location.address,
          area: location.area,
          city: location.city,
          state: location.state,
          pincode: location.pincode,
          tags,
          image_url: imageUrl,
          status: 'open',
          priority: 'medium'
        });

      if (error) throw error;

      toast.success("Report submitted successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("Infrastructure");
      setLocation({ lat: 15.4909, lng: 73.8278, address: "", area: "", city: "", state: "", pincode: "" });
      setTags([]);
      setSelectedImage(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      
      if (onBack) onBack();
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-card p-8 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-civic-teal/5 to-civic-darkBlue/5"></div>
        
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8 relative z-10"
        >
          {/* Mobile back button inside the report form for easy navigation */}
          {onBack && (
            // Use fixed positioning so the back button isn't clipped by the card's rounded/overflow
            // and stays visible above the form on small screens.
            <div className="md:hidden fixed left-4 top-4 z-50">
              <button
                onClick={onBack}
                className="px-3 py-1 bg-black/80 text-white rounded-md shadow-sm backdrop-blur-sm"
                aria-label="Back to dashboard"
              >
                ← Back
              </button>
            </div>
          )}
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Report an Issue</h2>
          <p className="text-slate-600">Help improve your community by reporting civic issues</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Title */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-slate-900 font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              className="w-full px-4 py-3 bg-white/80 border border-civic-teal/30 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent transition-all"
              required
            />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-slate-900 font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the issue..."
              rows={4}
              className="w-full px-4 py-3 bg-white/80 border border-civic-teal/30 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent resize-none transition-all"
              required
            />
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-slate-900 font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-civic-teal/30 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-slate-900 font-medium mb-2 flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </label>
            
            {/* Manual Address Input */}
            <div className="mb-4 space-y-3">
              <input
                type="text"
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                placeholder="Street Address / Landmark"
                className="w-full px-4 py-3 bg-white/80 border border-civic-teal/30 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent transition-all"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={location.area}
                  onChange={(e) => setLocation({ ...location, area: e.target.value })}
                  placeholder="Area / Locality"
                  className="w-full px-4 py-3 bg-white/80 border border-civic-teal/30 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-4 py-3 bg-white/80 border border-civic-teal/30 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value })}
                  placeholder="State"
                  className="w-full px-4 py-3 bg-white/80 border border-civic-teal/30 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  value={location.pincode}
                  onChange={(e) => setLocation({ ...location, pincode: e.target.value })}
                  placeholder="Pincode"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white/80 border border-civic-teal/30 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent transition-all"
                />
              </div>
              
              <p className="text-slate-500 text-xs mt-1.5">
                You can type an address manually or use the map below for precise GPS location
              </p>
            </div>

            {/* Get My Location Button */}
            <div className="mb-4">
              <motion.button
                type="button"
                onClick={handleGetLocation}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Navigation className="w-4 h-4" />
                <span>Use My Current Location</span>
              </motion.button>
            </div>

            <div className="bg-accent-orange/10 border-l-4 border-accent-orange p-4 rounded-lg mb-3">
              <p className="text-slate-700 font-medium text-sm flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-accent-orange" />
                <span>Click anywhere on the map to place a pin at your report location</span>
              </p>
              <p className="text-slate-600 text-xs mt-2">
                Current coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>

            {/* Google Map selector - click to choose a location */}
            <div className="rounded-xl overflow-hidden border-4 border-accent-orange shadow-lg">
              <GoogleInteractiveMap
                selectedLocation={location}
                onLocationSelect={handleLocationSelect}
                showLocationPicker={true}
              />
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-slate-900 font-medium mb-2 flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>Tags</span>
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 bg-white/80 border border-civic-teal/30 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent transition-all"
              />
              <motion.button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-civic-teal text-white rounded-lg hover:bg-civic-teal/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-civic-teal/20 text-civic-darkBlue rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-civic-darkBlue hover:text-slate-900 transition-colors"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Image Upload */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <label className="block text-slate-900 font-medium mb-2 flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Photo Evidence</span>
            </label>
            <div className="border-2 border-dashed border-civic-teal/30 rounded-lg p-6 text-center hover:border-civic-teal/50 transition-colors">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {selectedImage ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="space-y-2"
                >
                  <div className="text-civic-teal flex items-center justify-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Image selected: {selectedImage.name}</span>
                  </div>
                  <p className="text-slate-600 text-sm">AI will analyze this image for automatic categorization</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      if (imageInputRef.current) imageInputRef.current.value = "";
                    }}
                    className="text-accent-orange hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  <Camera className="w-12 h-12 text-slate-400 mx-auto" />
                  <div className="text-slate-700">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="text-civic-teal hover:text-civic-darkBlue underline transition-colors"
                    >
                      Click to upload
                    </button>{" "}
                    or drag and drop
                  </div>
                  <div className="text-slate-500 text-sm">PNG, JPG up to 10MB • AI analysis included</div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white font-semibold rounded-lg hover:from-civic-teal/90 hover:to-civic-darkBlue/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Report"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
