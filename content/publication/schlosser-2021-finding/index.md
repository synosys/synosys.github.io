---
title: "Finding disease outbreak locations from human mobility data"
authors:
- frank
- dirk

date: "2021-10-19"
doi: "10.1101/2021.06.21.21259258"

# Schedule page publish date (NOT publication's date).
publishDate: "2021-10-19"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["2"]

# Publication name and optional abbreviated publication name.
publication: "EPJ Data Science"
publication_short: ""

abstract: "Finding the origin location of an infectious disease outbreak quickly is crucial in mitigating its further dissemination. Current methods to identify outbreak locations early on rely on interviewing affected individuals and correlating their movements, which is a manual, time-consuming, and error-prone process. Other methods such as contact tracing, genomic sequencing or theoretical models of epidemic spread offer help, but they are not applicable at the onset of an outbreak as they require highly processed information or established transmission chains. Digital data sources such as mobile phones offer new ways to find outbreak sources in an automated way. Here, we propose a novel method to determine outbreak origins from geolocated movement data of individuals affected by the outbreak. Our algorithm scans movement trajectories for shared locations and identifies the outbreak origin as the most dominant among them. We test the method using various empirical and synthetic datasets, and demonstrate that it is able to single out the true outbreak location with high accuracy, requiring only data of N=4 individuals. The method can be applied to scenarios with multiple outbreak locations, and is even able to estimate the number of outbreak sources if unknown, while being robust to noise. Our method is the first to offer a reliable, accurate out-of-the-box approach to identify outbreak locations in the initial phase of an outbreak. It can be easily and quickly applied in a crisis situation, improving on previous manual approaches. The method is not only applicable in the context of disease outbreaks, but can be used to find shared locations in movement data in other contexts as well."

# Summary. An optional shortened abstract.
summary: ""

tags:
- COVID-19
- human mobility
- disease dynamics
- complex networks
- mobility networks
- pandemics
- epidemics
- outbreak reconstruction

featured: true

links:
- name: "View"
  url: https://epjdatascience.springeropen.com/articles/10.1140/epjds/s13688-021-00306-6#citeas

url_pdf: https://epjdatascience.springeropen.com/track/pdf/10.1140/epjds/s13688-021-00306-6.pdf
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
