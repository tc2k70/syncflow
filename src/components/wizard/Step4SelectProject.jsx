import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { fetchProjects } from '@/lib/mockApi';
import ProjectsTable from './ProjectsTable';
import CircuitsTable from './CircuitsTable';

const MOCK_CIRCUITS = {
  'PRJ-001': [
    { name: '2-0', segments: 1, class: 'DB_ES_ClassName_NEC_Divisions_Ordinary', voltage: '120 Vac', controlType: 'DB_TemperatureControlType_PipeSensing', temps: '40 °F / 35 °F / 35 °F', status: 'ok' },
    { name: '3-0', segments: 1, class: 'DB_ES_ClassName_NEC_Divisions_Ordinary', voltage: '120 Vac', controlType: 'DB_TemperatureControlType_PipeSensing', temps: '40 °F / 35 °F / 35 °F', status: 'ok' },
    { name: '1-0', segments: 1, class: 'DB_ES_ClassName_NEC_Divisions_Ordinary', voltage: '120 Vac', controlType: 'DB_TemperatureControlType_PipeSensing', temps: '40 °F / 35 °F / 35 °F', status: 'error' },
  ],
  'PRJ-002': [
    { name: 'A-1', segments: 2, class: 'DB_ES_ClassName_NEC_Divisions_Ordinary', voltage: '240 Vac', controlType: 'DB_TemperatureControlType_PipeSensing', temps: '50 °F / 45 °F / 40 °F', status: 'ok' },
    { name: 'B-1', segments: 1, class: 'DB_ES_ClassName_NEC_Divisions_Ordinary', voltage: '240 Vac', controlType: 'DB_TemperatureControlType_PipeSensing', temps: '50 °F / 45 °F / 40 °F', status: 'ok' },
  ],
};

export default function Step4SelectProject({ onNext, onBack }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedCircuit, setSelectedCircuit] = useState(null);

  useEffect(() => {
    fetchProjects().then(data => { setProjects(data); setLoading(false); });
  }, []);

  const circuits = selected ? (MOCK_CIRCUITS[selected.id] ?? []) : [];

  const handleSelectProject = (project) => {
    setSelected(project);
    setSelectedCircuit(null);
  };

  const handleReload = () => {
    setLoading(true);
    fetchProjects().then(d => { setProjects(d); setLoading(false); });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-none">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Select Project</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Choose a project from the database to import circuits into.</p>
      </div>

      <ProjectsTable
        projects={projects}
        loading={loading}
        selected={selected}
        onSelect={handleSelectProject}
        onReload={handleReload}
      />

      <CircuitsTable
        circuits={circuits}
        selected={selectedCircuit}
        onSelect={setSelectedCircuit}
        projectSelected={!!selected}
      />

      <div className="flex justify-between pt-2">
        {onBack ? <Button variant="outline" onClick={onBack}>← Back</Button> : <span />}
        <Button onClick={() => onNext(selected)} disabled={!selected}>
          Select File →
        </Button>
      </div>
    </div>
  );
}