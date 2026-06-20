"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { Upload, X, PawPrint, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { cn, isValidGeorgianPhone } from "@/lib/utils";
import { GEORGIAN_CITIES, getCityName } from "@/lib/cities";
import { useLang } from "@/lib/i18n/client";
import type { TranslationKey } from "@/lib/i18n";

const SPECIES = ["DOG", "CAT", "BIRD", "RABBIT", "FISH", "RODENT", "REPTILE", "EXOTIC"] as const;

type FormState = {
  title: string;
  species: string;
  breed: string;
  ageValue: string;
  ageUnit: string;
  gender: string;
  purpose: string;
  price: string;
  description: string;
  city: string;
  phone: string;
  vaccinationStatus: string;
};

const INITIAL: FormState = {
  title: "", species: "", breed: "", ageValue: "", ageUnit: "WEEKS",
  gender: "", purpose: "SALE", price: "", description: "", city: "",
  phone: "", vaccinationStatus: "",
};

export default function CreateListingPage() {
  const { data: session, status } = useSession();
  const { t, locale } = useLang();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(INITIAL);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <PawPrint className="w-12 h-12 text-blue-200" />
        <h1 className="text-xl font-bold text-gray-900">{t("form_signInToPost")}</h1>
        <p className="text-gray-500 text-sm max-w-xs">{t("form_signInMsg")}</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/create" })}
          className="bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors"
        >
          {t("form_signInGoogle")}
        </button>
      </div>
    );
  }

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFiles = async (files: FileList | null) => {
    if (!files || images.length >= 4) return;
    const remaining = 4 - images.length;
    const toUpload = Array.from(files).slice(0, remaining);

    setUploading(true);
    setError("");
    try {
      const uploaded = await Promise.all(
        toUpload.map(async (file) => {
          const compressed = await imageCompression(file, {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          const fd = new FormData();
          fd.append("file", compressed, file.name);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          if (!res.ok) throw new Error("Upload failed");
          const data = await res.json();
          return data.url as string;
        })
      );
      setImages((prev) => [...prev, ...uploaded]);
    } catch {
      setError(t("form_uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i: number) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { setError(t("form_minOnePhoto")); return; }
    if (!form.species) { setError(t("form_selectSpeciesError")); return; }
    if (!form.gender) { setError(t("form_selectGenderError")); return; }
    if (!form.vaccinationStatus) { setError(t("form_selectVaxError")); return; }
    if (!isValidGeorgianPhone(form.phone)) { setError(t("form_invalidPhone")); return; }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to create listing");
      }
      const { id } = await res.json();
      router.push(`/pets/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  const chip = (active: boolean, green?: boolean) =>
    cn(
      "px-4 py-2 rounded-full text-sm border transition-all cursor-pointer",
      active
        ? green
          ? "bg-green-600 text-white border-green-600"
          : "bg-blue-700 text-white border-blue-700"
        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300"
    );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("nav_postPet")}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t("form_createSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photos */}
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t("form_photos")} <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-4 gap-3">
            {images.map((url, i) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="120px" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs bg-blue-700 text-white px-1.5 py-0.5 rounded font-medium">
                    Cover
                  </span>
                )}
              </div>
            ))}
            {images.length < 4 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span className="text-xs">{t("form_addPhoto")}</span>
                  </>
                )}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <p className="text-xs text-gray-400 mt-2">{t("form_upToPhotos")}</p>
        </div>

        {/* Purpose */}
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t("form_purpose")} <span className="text-red-500">*</span></p>
          <div className="flex gap-3">
            <button type="button" onClick={() => set("purpose", "SALE")} className={chip(form.purpose === "SALE")}>
              {t("form_forSale")}
            </button>
            <button type="button" onClick={() => set("purpose", "BREEDING")} className={chip(form.purpose === "BREEDING", true)}>
              {t("form_forBreeding")}
            </button>
          </div>
        </div>

        {/* Species */}
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t("form_species")} <span className="text-red-500">*</span></p>
          <div className="flex flex-wrap gap-2">
            {SPECIES.map((s) => (
              <button key={s} type="button" onClick={() => set("species", s)} className={chip(form.species === s)}>
                {t(`form_${s.toLowerCase()}` as TranslationKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Title & Breed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
              {t("form_titleLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              required
              maxLength={100}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={t("form_titlePlaceholder")}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
              {t("form_breed")} <span className="text-red-500">*</span>
            </label>
            <input
              required
              maxLength={100}
              value={form.breed}
              onChange={(e) => set("breed", e.target.value)}
              placeholder={t("form_breedPlaceholder")}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
              {t("form_age")} <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="number"
              min="1"
              value={form.ageValue}
              onChange={(e) => set("ageValue", e.target.value)}
              placeholder="e.g. 8"
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_ageUnit")}</label>
            <select
              value={form.ageUnit}
              onChange={(e) => set("ageUnit", e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
            >
              <option value="WEEKS">{t("form_weeks")}</option>
              <option value="MONTHS">{t("form_months")}</option>
              <option value="YEARS">{t("form_years")}</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_gender")} <span className="text-red-500">*</span></p>
            <div className="flex gap-2">
              <button type="button" onClick={() => set("gender", "MALE")} className={chip(form.gender === "MALE")}>
                {t("form_male")}
              </button>
              <button type="button" onClick={() => set("gender", "FEMALE")} className={chip(form.gender === "FEMALE")}>
                {t("form_female")}
              </button>
            </div>
          </div>
        </div>

        {/* Price — only for SALE */}
        {form.purpose === "SALE" && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{t("form_price")}</label>
            <div className="relative max-w-xs">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₾</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder={t("form_leaveBlank")}
                className="w-full pl-8 pr-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Vaccination */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
            {t("form_vaccinationStatus")} <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.vaccinationStatus}
            onChange={(e) => set("vaccinationStatus", e.target.value)}
            className="w-full max-w-xs px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
          >
            <option value="" disabled>{t("form_vaccinationStatus")}</option>
            <option value="FULL">{t("form_fullyVaccinated")}</option>
            <option value="PARTIAL">{t("form_partial")}</option>
            <option value="NONE">{t("form_notVaccinated")}</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
            {t("form_description")} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            maxLength={2000}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder={t("form_descPlaceholder")}
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/2000</p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
            {t("form_city")} <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className="w-full max-w-xs px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
          >
            <option value="" disabled>{t("form_selectCity")}</option>
            {GEORGIAN_CITIES.map((c) => (
              <option key={c} value={c}>{getCityName(c, locale)}</option>
            ))}
          </select>
        </div>

        {/* Contact number */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
            {t("form_phone")} <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder={t("form_phonePlaceholder")}
            className={cn(
              "w-full max-w-xs px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
              form.phone && !isValidGeorgianPhone(form.phone)
                ? "border-red-400 focus:border-red-400"
                : "border-gray-200 dark:border-gray-700 focus:border-blue-400"
            )}
          />
          {form.phone && !isValidGeorgianPhone(form.phone) ? (
            <p className="text-xs text-red-500 mt-1.5">{t("form_invalidPhone")}</p>
          ) : (
            <p className="text-xs text-gray-400 mt-1.5">{t("form_phoneTip")}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full bg-blue-700 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("form_postListing")
          )}
        </button>
      </form>
    </div>
  );
}
