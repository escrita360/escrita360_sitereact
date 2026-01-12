import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'

export default function TestButton() {
  const navigate = useNavigate()
  
  const handleTest = () => {
    alert('Teste funcionando!')
    
    const testPlan = {
      name: 'Plano Teste',
      monthlyPrice: 120,
      yearlyPrice: 120,
      credits: 60,
      duration: '1 mês'
    }
    
    sessionStorage.setItem('selectedPlan', JSON.stringify(testPlan))
    sessionStorage.setItem('selectedAudience', 'teste')
    
    navigate('/pagamento', { 
      state: { 
        selectedPlan: testPlan, 
        audience: 'teste'
      } 
    })
  }
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button 
        onClick={handleTest}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        TESTE NAVEGAÇÃO
      </Button>
    </div>
  )
}