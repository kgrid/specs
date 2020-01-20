# Introduction

This section is non-normative.

This Knowledge Object Common Packaging (KOCP) specification describes an application-independent approach to the storage of computable knowledge objects in a structured, transparent, and predictable manner. It is designed to promote long-term access and management of compound digital objects within digital repositories, and deployment and integration of these objects as services in a broad class of runtimes (See KGRID Activation Spec).


## Purpose

The Knowledge Grid is focused on the externalization of computable knowledge in a readily managed and easily deployable form. We call a particular implementation of computable knowledge, packaged and ready for use in line with this specification, a Knowledge Object (KO). We face a challenge because the KOs have a dual nature, being managed as first-class digital artifacts (see FAIR principles) *and* as enablers of services in practice.

To be successful at both, the KOs should be packaged with useful descriptive and semantically appropriate structural metadata, and minimal required provenance metadata. With reference to the [OAIS] model, this might include descriptive, administrative, structural, representation and preservation metadata relevant to the object. A KO also requires standards-based descriptions of the services the object can provide and some hints about how to get it running, as well as the actual executable code and other resources.

The KGrid spec represents our recommendations on how to meet the following needs:

#### Externalization

To allow computable knowledge to be externalized and expressed as services

#### Service Orientation

To allow computable knowledge to be externalized and expressed as services

#### Interoperability

##### To interoperate with existing repositories 

##### To interoperate with a variety of runtime/deployment environments

#### Semantic Richness
Both for computation and domain concerns, semantic web ready. Open API, LDP, Dublin core, KOIO, 

#### Versioning

Semantic versioning; archival, implementation, and API versioning

#### Trust

Robustness, certifaction, verifiability, provenance, suitability, reputation.

```








```
---
---

### Notes:

### Describing KAAR (common vocabularies and standard identifiers; suitable as a SIP)

### Describing KAAS (KOIO and OpenAPI)

### Linking CBK with supporting/corroborative sources, incl. provenance 

### Additional domain and other descriptive metadata (is extensible)

### Versioning (both resource and service; e.g. artifact and API versioning)

### Some access to relevant artifacts in the package (KAAR/KAAS)

### Insuring the integrity of the package (at least as a whole) at the point of deployment

### Storage diversity (both LDP/RDF/Graph and simple file/cache storage)

### Ability to package multiple KOs as a collection with some integrity checks
