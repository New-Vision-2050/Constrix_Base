"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Term {
  id: number;
  label: string;
}

export default function TermsTab() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await fetch("/api/crm/terms");
      const data = await response.json();
      
      if (data.status === 200) {
        setTerms(data.payload);
      }
    } catch (error) {
      console.error("Error fetching terms:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {terms.map((term) => (
          <Card key={term.id} className="bg-[#29285E] border-[#29285E] hover:bg-[#3a3a7a] transition-colors">
            <CardHeader>
              <CardTitle className="text-white text-lg font-semibold">
                {term.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-300">
                Term ID: {term.id}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {terms.length === 0 && (
        <div className="text-center text-white p-8">
          No terms found
        </div>
      )}
    </div>
  );
}
