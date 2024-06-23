---
title: "Inferring country-specific import risk of diseases from the world air transportation network"
authors:
- pascal 
- adrian
- benjamin
- "Olga Baranov" 
- "Clara Jongen"
- "Frank Schlosser"
- "Stephen Gilbert"
- "Katie Baca-Motes"
- "Giorgio Quer" 
- marc
- dirk

date: "2024-01-24"
doi: "https://doi.org/10.1371/journal.pcbi.1011775"

# Schedule page publish date (NOT publication's date).
publishDate: "2024-01-24"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["3"]

# Publication name and optional abbreviated publication name.
publication: "PLOS Computational Biology 20 (1), e1011775 (2024)"
publication_short: ""

abstract: "Disease propagation between countries strongly depends on their effective distance, a measure derived from the world air transportation network (WAN). It reduces the complex spreading patterns of a pandemic to a wave-like propagation from the outbreak country, establishing a linear relationship to the arrival time of the unmitigated spread of a disease. However, in the early stages of an outbreak, what concerns decision-makers in countries is understanding the relative risk of active cases arriving in their country—essentially, the likelihood that an active case boarding an airplane at the outbreak location will reach them. While there are data-fitted models available to estimate these risks, accurate mechanistic, parameter-free models are still lacking. Therefore, we introduce the ‘import risk’ model in this study, which defines import probabilities using the effective-distance framework. The model assumes that airline passengers are distributed along the shortest path tree that starts at the outbreak’s origin. In combination with a random walk, we account for all possible paths, thus inferring predominant connecting flights. Our model outperforms other mobility models, such as the radiation and gravity model with varying distance types, and it improves further if additional geographic information is included. The import risk model’s precision increases for countries with stronger connections within the WAN, and it reveals a geographic distance dependence that implies a pull- rather than a push-dynamic in the distribution process."
          
# Summary. An optional shortened abstract.
summary: ""

tags:
 - COVID-19
 - Corona
 - mobility
featured: true

links:
- name: "View"
  url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1011775"

url_pdf: ""

#url_code: '#'
#url_dataset: '#'
#url_poster: '#'
#url_project: ''
#url_slides: ''
#url_source: '#'
#url_video: '#'

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
#slides: example
---
