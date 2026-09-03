from crewai.tools import BaseTool
import sympy

class SymPyMathTool(BaseTool):
    name: str = "SymPy Math Solver"
    description: str = "Solves mathematical expressions, equations, and complex math problems easily using SymPy."

    def _run(self, expression: str) -> str:
        try:
            result = sympy.sympify(expression)
            if hasattr(result, "evalf"):
                return str(result.evalf())
            return str(result)
        except Exception as e:
            return f"Error solving expression: {str(e)}"
