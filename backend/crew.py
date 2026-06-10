from crewai import Agent, Task, Crew, Process, LLM

class LegalSummarizerCrew:
    def __init__(self):
        self.llm = LLM(model="gemini/gemini-2.5-flash", temperature=0.3)
    
    def run(self, document_text: str):
        legal_analyst = Agent(
            role="Legal Document Analyst",
            goal="Analyze and summarize legal documents accurately",
            backstory="Expert legal analyst with years of experience in document review",
            llm=self.llm,
            verbose=True
        )
        
        risk_assessor = Agent(
            role="Legal Risk Assessor",
            goal="Identify potential risks and red flags in legal documents",
            backstory="Specialized legal consultant focused on risk management and compliance",
            llm=self.llm,
            verbose=True
        )
        
        summarize_task = Task(
            description=f"Summarize the following legal document, highlighting key points, obligations, and important clauses:\n\n{document_text}",
            agent=legal_analyst,
            expected_output="A concise summary with key legal points, parties involved, obligations, and critical clauses"
        )
        
        risk_assessment_task = Task(
            description=f"Review the legal document and identify potential risks, red flags, and areas of concern:\n\n{document_text}",
            agent=risk_assessor,
            expected_output="A risk assessment highlighting potential issues, ambiguous terms, and recommendations"
        )
        
        crew = Crew(
            agents=[legal_analyst, risk_assessor],
            tasks=[summarize_task, risk_assessment_task],
            process=Process.sequential,
            verbose=True
        )
        
        result = crew.kickoff()
        return str(result)
