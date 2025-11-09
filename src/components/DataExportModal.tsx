import { useState } from 'react'
import { UserResponse, Resource } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import { generateProviderExport, downloadJSON, generateHMISFormat, ProviderDataExport } from '../utils/dataExport'
import DataPrivacyDashboard from './DataPrivacyDashboard'
import './DataExportModal.css'

interface DataExportModalProps {
  responses: UserResponse
  selectedResources?: Resource[]
  resourceAssessments?: { [resourceId: string]: { [questionId: string]: any } }
  onClose: () => void
}

export default function DataExportModal({ 
  responses, 
  selectedResources, 
  resourceAssessments,
  onClose 
}: DataExportModalProps) {
  const { language } = useLanguage()
  const [exportFormat, setExportFormat] = useState<'standard' | 'hmis'>('standard')
  const [includeAssessments, setIncludeAssessments] = useState(true)
  const [includeSelectedResources, setIncludeSelectedResources] = useState(true)
  const [previewData, setPreviewData] = useState<ProviderDataExport | null>(null)
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set(Object.keys(responses)))

  const handleFieldToggle = (field: string, include: boolean) => {
    const newFields = new Set(selectedFields)
    if (include) {
      newFields.add(field)
    } else {
      newFields.delete(field)
    }
    setSelectedFields(newFields)
  }

  const generatePreview = () => {
    // Filter responses to only selected fields
    const filteredResponses = Object.fromEntries(
      Object.entries(responses).filter(([key]) => selectedFields.has(key))
    )

    if (exportFormat === 'standard') {
      const data = generateProviderExport(
        filteredResponses,
        includeSelectedResources ? selectedResources : undefined,
        includeAssessments ? resourceAssessments : undefined
      )
      setPreviewData(data)
    } else {
      // For HMIS, we'll show a simplified preview
      const hmisData = generateHMISFormat(filteredResponses)
      setPreviewData(hmisData as any)
    }
  }

  const handleExport = () => {
    // Filter responses to only selected fields
    const filteredResponses = Object.fromEntries(
      Object.entries(responses).filter(([key]) => selectedFields.has(key))
    )

    if (exportFormat === 'standard') {
      const data = generateProviderExport(
        filteredResponses,
        includeSelectedResources ? selectedResources : undefined,
        includeAssessments ? resourceAssessments : undefined
      )
      downloadJSON(data, 'youth-resource-data.json')
    } else {
      const hmisData = generateHMISFormat(filteredResponses)
      downloadJSON(hmisData as any, 'hmis-export.json')
    }
    onClose()
  }

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <button className="export-close" onClick={onClose}>×</button>
        
        <h2>{language === 'es' ? 'Exportar Datos para Proveedores' : 'Export Data for Providers'}</h2>
        <p className="export-intro">
          {language === 'es' 
            ? 'Puedes exportar tu información en un formato que los proveedores de recursos pueden usar. Esto evita que tengas que llenar los mismos formularios varias veces.'
            : 'You can export your information in a format that resource providers can use. This helps you avoid filling out the same forms multiple times.'
          }
        </p>

        <div className="export-options">
          <div className="option-group">
            <label className="option-label">
              <input
                type="radio"
                name="format"
                value="standard"
                checked={exportFormat === 'standard'}
                onChange={(e) => setExportFormat(e.target.value as 'standard' | 'hmis')}
              />
              <span>
                <strong>{language === 'es' ? 'Formato Estándar' : 'Standard Format'}</strong>
                <small>{language === 'es' ? 'Formato simple y fácil de usar' : 'Simple, easy-to-use format'}</small>
              </span>
            </label>
          </div>

          <div className="option-group">
            <label className="option-label">
              <input
                type="radio"
                name="format"
                value="hmis"
                checked={exportFormat === 'hmis'}
                onChange={(e) => setExportFormat(e.target.value as 'standard' | 'hmis')}
              />
              <span>
                <strong>HMIS Format</strong>
                <small>{language === 'es' ? 'Formato compatible con sistemas HMIS' : 'Compatible with HMIS systems'}</small>
              </span>
            </label>
          </div>
        </div>

        <div className="export-includes">
          <h3>{language === 'es' ? 'Incluir en la Exportación' : 'Include in Export'}</h3>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeSelectedResources}
              onChange={(e) => setIncludeSelectedResources(e.target.checked)}
            />
            <span>
              {language === 'es' 
                ? 'Recursos seleccionados (información de contacto)'
                : 'Selected resources (contact information)'
              }
            </span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeAssessments}
              onChange={(e) => setIncludeAssessments(e.target.checked)}
            />
            <span>
              {language === 'es' 
                ? 'Evaluaciones de recursos (respuestas a preguntas de seguimiento)'
                : 'Resource assessments (follow-up question responses)'
              }
            </span>
          </label>
        </div>

        {/* Data Privacy Dashboard */}
        <DataPrivacyDashboard
          responses={responses}
          onFieldToggle={handleFieldToggle}
          selectedFields={selectedFields}
        />

        <div className="export-actions">
          <button onClick={generatePreview} className="preview-btn">
            {language === 'es' ? 'Vista Previa' : 'Preview'}
          </button>
          <button onClick={handleExport} className="export-btn">
            {language === 'es' ? '📥 Descargar JSON' : '📥 Download JSON'}
          </button>
        </div>

        {previewData && (
          <div className="export-preview">
            <h3>{language === 'es' ? 'Vista Previa de Datos' : 'Data Preview'}</h3>
            <pre>{JSON.stringify(previewData, null, 2)}</pre>
          </div>
        )}

        <div className="export-privacy-note">
          <p>
            <strong>{language === 'es' ? 'Nota de Privacidad:' : 'Privacy Note:'}</strong>{' '}
            {language === 'es'
              ? 'Solo exporta lo que te sientas cómodo compartiendo. Puedes elegir qué incluir antes de descargar.'
              : 'Only export what you\'re comfortable sharing. You can choose what to include before downloading.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

