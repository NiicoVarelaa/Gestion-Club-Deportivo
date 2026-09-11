import { useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'

function filterSocios(socios, searchTerm) {
  return socios.filter((s) =>
    `${s.nombre} ${s.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  )
}

export default function SocioSelect({ socios = [], value, onSelect, onClear, error }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filteredSocios = filterSocios(socios, searchTerm)

  const selectSocio = (socio) => {
    setSearchTerm(`${socio.nombre} ${socio.apellido}`)
    onSelect?.(socio)
    setDropdownOpen(false)
  }

  const clearSocio = () => {
    setSearchTerm('')
    onClear?.()
    setDropdownOpen(false)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="socioSearch">Socio</Label>
      <div className="relative">
        <Input
          id="socioSearch"
          placeholder="Buscar socio por nombre o apellido..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setDropdownOpen(true) }}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
        />
        {value && (
          <button
            type="button"
            onClick={clearSocio}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        )}
        {dropdownOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-48 overflow-y-auto">
            {filteredSocios.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</p>
            ) : (
              filteredSocios.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                  onMouseDown={(e) => { e.preventDefault(); selectSocio(s) }}
                >
                  {s.nombre} {s.apellido}
                  <span className="ml-2 text-xs text-muted-foreground">DNI {s.dni}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}