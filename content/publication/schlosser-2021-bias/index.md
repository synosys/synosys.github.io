---
title: "Biases in human mobility data impact epidemic modeling"
authors:
- frank
- "Vedran Sekara"
- dirk
- Manuel Garcia-Herranz

date: "2021-12-23"
#doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2021-12-23"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["3"]

# Publication name and optional abbreviated publication name.
publication: "arXiv:2112.12521"
publication_short: ""

abstract: "Large-scale human mobility data is a key resource in data-driven policy making and across many scientific fields. Most recently, mobility data was extensively used during the COVID-19 pandemic to study the effects of governmental policies and to inform epidemic models. Large-scale mobility is often measured using digital tools such as mobile phones. However, it remains an open question how truthfully these digital proxies represent the actual travel behavior of the general population. Here, we examine mobility datasets from multiple countries and identify two fundamentally different types of bias caused by unequal access to, and unequal usage of mobile phones. We introduce the concept of data generation bias, a previously overlooked type of bias, which is present when the amount of data that an individual produces influences their representation in the dataset. We find evidence for data generation bias in all examined datasets in that high-wealth individuals are overrepresented, with the richest 20% contributing over 50% of all recorded trips, substantially skewing the datasets. This inequality is consequential, as we find mobility patterns of different wealth groups to be structurally different, where the mobility networks of high-wealth users are denser and contain more long-range connections. To mitigate the skew, we present a framework to debias data and show how simple techniques can be used to increase representativeness. Using our approach we show how biases can severely impact outcomes of dynamic processes such as epidemic simulations, where biased data incorrectly estimates the severity and speed of disease transmission. Overall, we show that a failure to account for biases can have detrimental effects on the results of studies and urge researchers and practitioners to account for data-fairness in all future studies of human mobility."

# Summary. An optional shortened abstract.
summary: ""

tags:
- human mobility
- disease dynamics
- complex networks
- mobility networks
- pandemics
- epidemics

featured: true

links:
- name: "View"
  url: https://arxiv.org/abs/2112.12521

url_pdf: https://arxiv.org/pdf/2112.12521.pdf
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
  caption: ''
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
