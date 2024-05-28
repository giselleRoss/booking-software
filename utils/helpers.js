import { categories } from "@/app/constants/config";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const selectOptions = categories.map((category) => ({value: category, label: capitalize(category)}))