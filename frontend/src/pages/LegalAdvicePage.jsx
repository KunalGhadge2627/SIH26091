import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Scale, Phone, MapPin, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import LocationMap from '../components/map/LocationMap';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export const LegalAdvicePage = () => {
  const { translate: t } = useLanguage();
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('assessment') || 'ASM_DEFAULT';

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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Legal Advice & Documentation" />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <span className="eyebrow">{t('REGULATORY & AID DIRECTORY')}</span>
            <h1 className="text-2xl font-bold text-gray-900">{t('Legal Advice & Registration Support')}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{t('Find nearby District Legal Services Authorities and required business registration documents.')}</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">{t('Loading nearest legal offices and document checklists...')}</div>
          ) : (
            <div className="space-y-8">
              {/* Section 1: Nearest Legal Offices */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
                <div>
                  <span className="eyebrow">{t('DISTRICT AID CENTRES')}</span>
                  <h2 className="text-xl font-bold text-gray-900">{t('Legal & registration support near you')}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{t('Contact official legal services authorities for MSME registration and report review.')}</p>
                </div>

                {/* Map */}
                <div className="h-64">
                  <LocationMap 
                    lat={offices[0]?.latitude || 18.5308} 
                    lng={offices[0]?.longitude || 73.8474} 
                    villageName={offices[0]?.district || "District Office"} 
                  />
                </div>

                {/* Office Cards */}
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  {offices.map((off) => (
                    <div key={off.office_id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-primary-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                          {off.office_type}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 mt-1">{off.name}</h3>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          <span>{off.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="font-semibold text-gray-900">{off.phone}</span>
                        </div>
                      </div>

                      {/* Service Offered Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-200">
                        {off.services_offered?.map((srv, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-white text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                            {srv.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Document Checklist */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
                <div>
                  <span className="eyebrow">{t('REGULATORY COMPLIANCE')}</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t("Documents you'll need to register")} {checklist.category || t('Business')}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">{t('Required identity documents and local government trade licenses.')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Identity & Bank Documents */}
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-xs text-gray-900 uppercase tracking-wider">
                      <FileCheck className="w-4 h-4 text-primary-600" />
                      <span>{t('Required Identity & Bank Documents')}</span>
                    </div>

                    <ul className="space-y-2 text-xs text-gray-700 font-medium">
                      {checklist.document_list?.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Regulatory & Trade Licenses */}
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-xs text-amber-900 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>{t('Regulatory & Trade Requirements')}</span>
                    </div>

                    <ul className="space-y-2 text-xs text-amber-950 font-medium">
                      {checklist.regulatory_requirements?.map((reg, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
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
