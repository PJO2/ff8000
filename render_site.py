# -------------------------
# Generate the HTML page from templates 
# -------------------------
# template.j2 defines the structure and includes headers, menu, [pages], footer
# the [pages] are j2 templates and may use the data collected in data directory

import jinja2
import json
import os

# go to shared directory
os.chdir ('/media/sf_homes/ff8000/promotion/web_site/ff8000')

# Site pages
PAGES = [ 'accueil', 'blog', 'certifs', 'contact', 'references', 'services' ]
LANGUAGES = [ 'en', 'fr' ]
# LANGUAGES = [ 'fr' ]

for language in LANGUAGES:
   # Charger le fichier de donnees JSON
   with open(f"data/data_{language}.json", "r", encoding="utf-8") as file:
       data = json.load(file)

   for page in PAGES:
       # Configurer Jinja2
       env = jinja2.Environment(loader=jinja2.FileSystemLoader("."))
       try:
           template = env.get_template("template.j2")
           html_output = template.render(data=data, lang=language, page=page)
       except jinja2.TemplateNotFound as e:
           print(f"Erreur : Template '{e.name}' introuvable. Vérifie son emplacement dans le dossier 'templates/'.")
           exit(1)
       except jinja2.TemplateSyntaxError as e:
           print(f"Erreur de syntaxe dans le template '{e.filename}' à la ligne {e.lineno}: {e.message}")
       except jinja2.UndefinedError as e:
           print(f"Erreur de variable indéfinie dans le template : {e.message}")
       except Exception as e:
           print(f"Erreur inattendue : {e}")

       # enregistrer le résultat
       print(f"/{language}/{page}.html") 
       with open(f"static/{language}/{page}.html", "w", encoding="utf-8") as f:
           f.write(html_output)  # sauvegarder le rendu dans un fichier

