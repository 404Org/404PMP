import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';

const TechStackCombobox = ({ selectedTechs, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelectedTechs, setLocalSelectedTechs] = useState(selectedTechs || []);

  useEffect(() => {
    setLocalSelectedTechs(selectedTechs || []);
  }, [selectedTechs]);

  const techStacks = {
    "Programming Languages": [
      "JavaScript",
      "Python",
      "Java",
      "C++",
      "C#",
      "Ruby",
      "PHP",
      "Swift",
      "TypeScript",
      "Go",
      "Kotlin",
      "R",
      "MATLAB",
      "Scala",
      "Rust"
    ],
    "Web Technologies": [
      "HTML5",
      "CSS3",
      "React.js",
      "Angular",
      "Vue.js",
      "Node.js",
      "Express.js",
      "Django",
      "Spring Framework",
      "ASP.NET",
      "Ruby on Rails",
      "Laravel",
      "jQuery",
      "Bootstrap",
      "Tailwind CSS",
      "webpack",
      "REST APIs",
      "GraphQL"
    ],
    "Databases": [
      "SQL",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Oracle Database",
      "Microsoft SQL Server",
      "Redis",
      "Elasticsearch",
      "Cassandra",
      "Firebase"
    ],
    "Cloud Platforms": [
      "Amazon Web Services (AWS)",
      "Microsoft Azure",
      "Google Cloud Platform",
      "Heroku",
      "DigitalOcean",
      "Cloudflare"
    ],
    "DevOps & Tools": [
      "Git",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "Linux",
      "JIRA",
      "Confluence",
      "Maven",
      "Gradle",
      "npm",
      "Terraform",
      "Ansible"
    ],
    "Testing": [
      "Unit Testing",
      "Jest",
      "Selenium",
      "JUnit",
      "TestNG",
      "Cypress",
      "Mocha",
      "PHPUnit"
    ],
    "AI/ML & Data": [
      "Machine Learning",
      "TensorFlow",
      "PyTorch",
      "scikit-learn",
      "Pandas",
      "NumPy",
      "Apache Spark",
      "Power BI",
      "Tableau",
      "SAS"
    ],
    "Mobile Development": [
      "iOS Development",
      "Android Development",
      "React Native",
      "Flutter",
      "Xamarin",
      "SwiftUI",
      "Kotlin Android"
    ],
    "Project Management": [
      "Agile Methodologies",
      "Scrum",
      "Kanban",
      "Waterfall",
      "Project Planning",
      "Team Leadership"
    ],
    "Design Tools": [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "InVision"
    ]
  };

  const handleSelectTech = (tech) => {
    if (!localSelectedTechs.includes(tech)) {
      const newSelectedTechs = [...localSelectedTechs, tech];
      setLocalSelectedTechs(newSelectedTechs);
      onChange(newSelectedTechs);
      setSearchTerm('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    const newSelectedTechs = localSelectedTechs.filter(tech => tech !== techToRemove);
    setLocalSelectedTechs(newSelectedTechs);
    onChange(newSelectedTechs);
  };

  const handleCustomTechAdd = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() && !localSelectedTechs.includes(searchTerm.trim())) {
      const newSelectedTechs = [...localSelectedTechs, searchTerm.trim()];
      setLocalSelectedTechs(newSelectedTechs);
      onChange(newSelectedTechs);
      setSearchTerm('');
      e.preventDefault();
    }
  };

  const filteredTechStacks = Object.fromEntries(
    Object.entries(techStacks).map(([category, techs]) => [
      category,
      techs.filter(tech => 
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ]).filter(([_, techs]) => techs.length > 0)
  );

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <div className="w-full pl-10 pr-3 py-2 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap items-center gap-2">
            {localSelectedTechs.map((tech) => (
              <span
                key={tech}
                className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm flex items-center gap-1"
              >
                {tech}
                <button
                  onClick={() => handleRemoveTech(tech)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleCustomTechAdd}
              placeholder={localSelectedTechs.length === 0 ? "Skills" : ""}
              className="flex-1 outline-none min-w-[150px]"
            />
          </div>

          {searchTerm && (
            <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border max-h-40 overflow-y-auto">
              {Object.entries(filteredTechStacks).map(([category, techs]) => (
                <div key={category} className="p-2">
                  <div className="text-sm font-semibold text-gray-500 pl-2 pb-1">
                    {category}
                  </div>
                  {techs.map((tech) => (
                    <div
                      key={tech}
                      className="px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => handleSelectTech(tech)}
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              ))}
              {Object.keys(filteredTechStacks).length === 0 && (
                <div className="p-2 text-gray-500 text-sm">
                  Press Enter to add "{searchTerm}" as a custom technology
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechStackCombobox;