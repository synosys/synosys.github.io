---
# Documentation: https://wowchemy.com/docs/managing-content/

title: Massive parallelization boosts big Bayesian multidimensional scaling
subtitle: ''
summary: ''
authors:
- A J Holbrook
- P Lemey
- G Baele
- S Dellicour
- dirk
- A Rambaut
- M A Suchard

tags:
- Bayesian
- phylogeography

categories: []
date: '2020-01-01'
lastmod: 2021-01-30T17:31:11+01:00
featured: false
draft: false


doi: "10.1080/10618600.2020.1754226"


links:
- name: "View"
  url: https://www.tandfonline.com/doi/abs/10.1080/10618600.2020.1754226

url_pdf: "https://www.tandfonline.com/doi/pdf/10.1080/10618600.2020.1754226?casa_token=q8kL7Nywf4QAAAAA:q91CL9Ubl-LHn0INJ78S5zdKW9TO_eUk4j_YJsm9nfZS-wSXwAGRst98aAhrqqSM8cL9KnDhPl4z"

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ''
  focal_point: ''
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
publishDate: '2021-01-30T16:31:10.993606Z'
publication_types:
- '2'
abstract: 'Big Bayes is the computationally intensive co-application of big data and large, expressive Bayesian models for the analysis of complex phenomena in scientific inference and statistical learning. Standing as an example, Bayesian multidimensional scaling (MDS) can help scientists learn viral trajectories through space-time, but its computational burden prevents its wider use. Crucial MDS model calculations scale quadratically in the number of observations. We partially mitigate this limitation through massive parallelization using multi-core central processing units, instruction-level vectorization and graphics processing units (GPUs). Fitting the MDS model using Hamiltonian Monte Carlo, GPUs can deliver more than 100-fold speedups over serial calculations and thus extend Bayesian MDS to a big data setting. To illustrate, we employ Bayesian MDS to infer the rate at which different seasonal influenza virus subtypes use worldwide air traffic to spread around the globe. We examine 5392 viral sequences and their associated 14 million pairwise distances arising from the number of commercial airline seats per year between viral sampling locations. To adjust for shared evolutionary history of the viruses, we implement a phylogenetic extension to the MDS model and learn that subtype H3N2 spreads most effectively, consistent with its epidemic success relative to other seasonal influenza subtypes. Finally, we provide MassiveMDS, an open-source, stand-alone C++ library and rudimentary R package, and discuss program design and high-level implementation with an emphasis on important aspects of computing architecture that become relevant at scale.'

publication: 'Journal of Computational and Graphical Statistics, DOI: 10.1080/10618600.2020.1754226'

---
