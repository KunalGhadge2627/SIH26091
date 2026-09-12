import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, MapPin, CheckCircle2, FileCheck, ShieldCheck } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import LocationMap from '../components/map/LocationMap';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export const LegalAdvicePage = () => {
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('assessment') || 'ASM_DEFAULT';
  const { t } = useLanguage();

  const [legalData, setLegalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegal = async () => {
      setLoading(true);
      try {
        let data = null;
        if (assessmentId && assessmentId !== 'ASM_DEFAULT') {
          const resp = await api.getAssessmentLegalOffices(assessmentId);
          data = resp.data;
        } else {
          // Default fallback to Pune district legal offices and Dairy checklist
          const [officesResp, checkResp] = await Promise.all([
            api.getLegalOffices('Pune'),
            api.getDocumentChecklist('Dairy')
          ]);
          data = {
            nearest_legal_offices: officesResp.data,
            document_checklist: checkResp.data
          };
        }
        setLegalData(data);
      } catch (err) {
        console.error("Legal advice fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLegal();
  }, [assessmentId]);

  const offices = legalData?.nearest_legal_offices || [];
  const checklist = legalData?.document_checklist || {};

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Legal Advice & Documentation" />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="border-b border-turf-border pb-4">
            <span className="eyebrow">Regulatory & aid directory</span>
            <h1 className="text-2xl font-bold text-turf-text">{t('Legal Advice & Registration Support')}</h1>
            <p className="text-xs text-turf-text-muted mt-0.5">Find nearby District Legal Services Authorities and required business registration documents.</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-turf-text-muted">Loading nearest legal offices and document checklists...</div>
          ) : (
            <div className="space-y-8">
              {/* Section 1: Nearest Legal Offices */}
              <div className="bg-white border border-turf-border rounded-2xl p-6 md:p-8 space-y-6">
                <div>
                  <span className="eyebrow">District aid centres</span>
                  <h2 className="text-xl font-bold text-turf-text">Legal & registration support near you</h2>
                  <p className="text-xs text-turf-text-muted mt-0.5">Contact official legal services authorities for MSME registration and report review.</p>
                </div>

                {/* Map */}
                <div className="h-64">
                  <LocationMap 
                    lat={offices[0]?.latitude || 18.5308} 
                    lng={offices[0]?.longitude || 73.8474} 
                    villageName={offices[0]?.district || "District Office"} 
                  />
                </div>

                {/* Office Cards (Data Cards Fills) */}
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  {offices.map((off) => (
                    <div key={off.office_id} className="p-5 rounded-2xl bg-turf-surface border border-turf-border space-y-3">
                      <div>
                        <span className="text-[10px] font-semibold text-turf-primary bg-white border border-turf-border px-2 py-0.5 rounded-lg">
                          {off.office_type}
                        </span>
                        <h3 className="text-sm font-bold text-turf-text mt-1.5">{off.name}</h3>
                      </div>

                      <div className="space-y-1.5 text-xs text-turf-text">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-turf-text-muted shrink-0 mt-0.5" />
                          <span>{off.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-turf-text-muted shrink-0" />
                          <span className="font-semibold text-turf-text stat-number">{off.phone}</span>
                        </div>
                      </div>

                      {/* Service Offered Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-turf-border">
                        {off.services_offered?.map((srv, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-white text-turf-text-muted px-2 py-0.5 rounded-lg border border-turf-border">
                            {srv.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Document Checklist */}
              <div className="bg-white border border-turf-border rounded-2xl p-6 md:p-8 space-y-6">
                <div>
                  <span className="eyebrow">Regulatory compliance</span>
                  <h2 className="text-xl font-bold text-turf-text">
                    Documents you'll need to register {checklist.category || 'Business'}
                  </h2>
                  <p className="text-xs text-turf-text-muted mt-0.5">Required identity documents and local government trade licenses.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Identity & Bank Documents */}
                  <div className="p-5 rounded-2xl bg-turf-surface border border-turf-border space-y-3">
                    <div className="flex items-center gap-2 font-semibold text-xs text-turf-text">
                      <FileCheck className="w-4 h-4 text-turf-primary" />
                      <span>Required Identity & Bank Documents</span>
                    </div>

                    <ul className="space-y-2 text-xs text-turf-text font-medium">
                      {checklist.document_list?.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-turf-primary shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Regulatory & Trade Licenses */}
                  <div className="p-5 rounded-2xl bg-turf-surface border border-turf-border space-y-3">
                    <div className="flex items-center gap-2 font-semibold text-xs text-turf-text">
                      <ShieldCheck className="w-4 h-4 text-turf-primary" />
                      <span>Regulatory & Trade Requirements</span>
                    </div>

                    <ul className="space-y-2 text-xs text-turf-text-muted font-medium">
                      {checklist.regulatory_requirements?.map((reg, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-turf-primary font-bold">•</span>
                          <span>{reg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <DisclaimerBanner text="Legal advice and document checklists are for informational support. Verify exact registration steps with local District Industries Centres." />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LegalAdvicePage;
