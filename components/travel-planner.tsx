"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToastContainer } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"


// Interfaces
interface ItinerarioParams {
  destination: string;
  days: number;
  tripType: string;
  interests: string;
  budget: number;
}

interface FormState {
  destination: string;
  days: number[];
  tripType: string;
  interests: string;
  budget: string;
}

// Hook personalizado para gerir o formulário
const useFormState = (initialState: FormState) => {
  const [state, setState] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const validateField = useCallback((name: keyof FormState, value: string | number[]) => {
    let error = ""
    switch (name) {
      case "destination":
        if (!value) error = "O destino não pode estar vazio."
        break
      case "budget":
        if (isNaN(Number(value)) || Number(value) <= 0) error = "O orçamento deve ser um número maior que zero."
        break
      // Adicione mais validações conforme necessário
    }
    setErrors(prev => ({ ...prev, [name]: error }))
    return !error
  }, [])

  const handleChange = useCallback((name: keyof FormState, value: string | number[]) => {
    setState(prev => ({ ...prev, [name]: value }))
    validateField(name, value)
  }, [validateField])

  return { state, handleChange, errors }
}

// Componente do formulário
const TravelForm = ({ onSubmit, isLoading }: { onSubmit: (data: ItinerarioParams) => void, isLoading: boolean }) => {
  const { state, handleChange, errors } = useFormState({
    destination: "",
    days: [7],
    tripType: "",
    interests: "",
    budget: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(errors).every(error => !error)) {
      onSubmit({
        ...state,
        days: state.days[0],
        budget: Number(state.budget),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div>
        <Label htmlFor="destination" className="text-lg font-semibold text-gray-700">Destino</Label>
        <Input
          id="destination"
          value={state.destination}
          onChange={(e) => handleChange("destination", e.target.value)}
          placeholder="Ex: Paris, França"
          required
          aria-invalid={!!errors.destination}
          aria-describedby={errors.destination ? "destination-error" : undefined}
          className={`mt-1 shadow-sm rounded-md focus:ring-2 focus:ring-blue-300 transition ${errors.destination ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.destination && (
          <p id="destination-error" className="text-red-500 text-sm mt-1">{errors.destination}</p>
        )}
      </div>
      <div>
        <Label htmlFor="days" className="text-lg font-semibold text-gray-700">Número de dias ({state.days[0]})</Label>
        <Slider
          id="days"
          min={1}
          max={30}
          step={1}
          value={state.days}
          onValueChange={(value) => handleChange("days", value)}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="tripType" className="text-lg font-semibold text-gray-700">Tipo de Viagem</Label>
        <Select value={state.tripType} onValueChange={(value) => handleChange("tripType", value)}>
          <SelectTrigger className="mt-1 shadow-sm rounded-md focus:ring-2 focus:ring-blue-300 transition">
            <SelectValue placeholder="Selecione o tipo de viagem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lazer">Lazer</SelectItem>
            <SelectItem value="aventura">Aventura</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="gastronomica">Gastronómica</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="interests" className="text-lg font-semibold text-gray-700">Interesses</Label>
        <Input
          id="interests"
          value={state.interests}
          onChange={(e) => handleChange("interests", e.target.value)}
          placeholder="Ex: museus, praia, caminhadas"
          className="mt-1 shadow-sm rounded-md focus:ring-2 focus:ring-blue-300 transition"
        />
      </div>
      <div>
        <Label htmlFor="budget" className="text-lg font-semibold text-gray-700">Orçamento Total</Label>
        <Input
          id="budget"
          type="number"
          value={state.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
          placeholder="Ex: 1000"
          min="0"
          className={`mt-1 shadow-sm rounded-md focus:ring-2 focus:ring-blue-300 transition ${errors.budget ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.budget && (
          <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        disabled={isLoading || Object.values(errors).some(error => !!error)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            A gerar itinerário...
          </>
        ) : (
          "Gerar Itinerário"
        )}
      </Button>
    </form>
  )
}

// Componente do itinerário
const ItineraryDisplay = ({ itinerary, tripDetails }: { itinerary: string, tripDetails: ItinerarioParams }) => {
  const { toast } = useToast()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(itinerary).then(() => {
      toast({
        title: "Itinerário copiado!",
        description: "O itinerário foi copiado para a área de transferência.",
      })
    })
  }, [itinerary, toast])

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-4 text-blue-700">Detalhes da Viagem:</h3>
      <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
        <li>Destino: <span className="font-medium">{tripDetails.destination}</span></li>
        <li>Duração: <span className="font-medium">{tripDetails.days} dias</span></li>
        <li>Tipo de Viagem: <span className="font-medium">{tripDetails.tripType}</span></li>
        <li>Interesses: <span className="font-medium">{tripDetails.interests}</span></li>
        <li>Orçamento: <span className="font-medium">{tripDetails.budget} euros</span></li>
      </ul>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-700">Itinerário:</h3>
        <Button onClick={handleCopy} variant="outline" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Copiar
        </Button>
      </div>
      <div className="whitespace-pre-wrap text-gray-800 bg-blue-100 p-6 rounded-lg shadow-sm leading-relaxed text-lg">
        {itinerary}
      </div>
    </div>
  )
}

// Função principal do componente
export function TravelPlannerComponent() {
  const [itinerary, setItinerary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("form")
  const [tripDetails, setTripDetails] = useState<ItinerarioParams | null>(null)

  const handleSubmit = useCallback(async (data: ItinerarioParams) => {
    setError(null)
    setIsLoading(true)
    try {
      console.log("Iniciando geração de itinerário...")
      const generatedItinerary = await gerarItinerario(data)
      setItinerary(generatedItinerary)
      setTripDetails(data)
      setActiveTab("itinerary")
      console.log("Itinerário gerado com sucesso!")
    } catch (error: unknown) {
      console.error("Erro ao gerar itinerário:", error)
      if (error instanceof Error) {
        setError(`Ocorreu um erro ao gerar o itinerário: ${error.message}`)
      } else {
        setError("Ocorreu um erro desconhecido ao gerar o itinerário.")
      }
      setItinerary("")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <>
      <div className="container mx-auto p-4 max-w-3xl">
        <Card className="bg-gradient-to-b from-blue-50 to-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-800 mb-2">Assistente de Planeamento de Viagens</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Preencha os detalhes da sua viagem para gerar um itinerário personalizado e emocionante.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Formulário</TabsTrigger>
                <TabsTrigger value="itinerary" disabled={!itinerary}>Itinerário</TabsTrigger>
              </TabsList>
              <TabsContent value="form">
                <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
                {error && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow">
                    {error}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="itinerary">
                {itinerary && tripDetails && <ItineraryDisplay itinerary={itinerary} tripDetails={tripDetails} />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </>
  )
}

// Função assíncrona para gerar o itinerário (mantida como estava)
async function gerarItinerario(params: ItinerarioParams): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("A chave da API da Groq não está definida.");
  }

  const prompt = `Gere um itinerário detalhado para uma viagem com as seguintes características:
    Destino: ${params.destination}
    Duração: ${params.days} dias
    Tipo de viagem: ${params.tripType}
    Interesses: ${params.interests}
    Orçamento total: ${params.budget} euros

    Por favor, forneça um itinerário dia a dia, incluindo sugestões de atividades, locais para visitar, e recomendações de restaurantes que se encaixem no orçamento e nos interesses especificados.`;

  try {
    console.log("Enviando requisição para a API da Groq...");
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // Modelo atualizado
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log("Resposta recebida. Status:", response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Corpo da resposta de erro:", errorBody);
      throw new Error(`Erro na API: ${response.status}. Detalhes: ${errorBody}`);
    }

    const data = await response.json();
    console.log("Dados recebidos da API:", data);
    return data.choices[0].message.content.trim();
  } catch (error: unknown) {
    console.error("Erro detalhado ao gerar itinerário:", error);
    if (error instanceof Error) {
      throw new Error(`Não foi possível gerar o itinerário. Erro: ${error.message}`);
    } else {
      throw new Error("Ocorreu um erro desconhecido ao gerar o itinerário.");
    }
  }
}