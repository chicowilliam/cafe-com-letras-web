"""Regera todos os artboards .dc.html a partir dos geradores (fonte original do design)."""
import runpy, os
here = os.path.dirname(os.path.abspath(__file__))
os.chdir(here)
for m in ["main", "gastro", "prog", "evento", "livraria", "casa", "mobile"]:
    runpy.run_path(os.path.join(here, m + ".py"), run_name="__main__")
