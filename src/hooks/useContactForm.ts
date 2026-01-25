"use client";
import { useState, useCallback } from "react";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface UseContactFormOptions {
  formName?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useContactForm(options: UseContactFormOptions = {}) {
  const { formName = "contact", onSuccess, onError } = options;

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) {
      setError("Imię i nazwisko jest wymagane");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email jest wymagany");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Podaj prawidłowy adres email");
      return false;
    }
    if (!formData.message.trim()) {
      setError("Wiadomość jest wymagana");
      return false;
    }
    return true;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({ name: "", email: "", message: "" });
    setError("");
    setSuccess(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formName,
          ...formData,
          company: "", // honeypot field
        }),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas wysyłania formularza");
      }

      setSuccess(true);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.";
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, formName, validateForm, resetForm, onSuccess, onError]);

  return {
    formData,
    loading,
    success,
    error,
    handleChange,
    handleSubmit,
    resetForm,
    setError,
  };
}
