# Introduction

This section is non-normative.

This Knowledge Object Common Packaging (KOCP) specification describes an application-independent approach to the storage of computable knowledge objects in a structured, transparent, and predictable manner. It is designed to promote long-term access and management of digital objects within digital repositories, and deployment and integration of KOs as services in a broad class of runtimes (See KGRID Activation Spec).


## Purpose

The Knowledge Grid promotes relies on the externalization of computable knowledge in a readily managed and easily deployable form. We face a challenge because the KOs have a dual nature, being managed as first-class digital artifacts (see FAIR principles) *and* as enablers of services in practice.

To be successful at both, the KOs should be packaged with useful descriptive and semantically appropriate structural metadata, minimal required provenance metadata. They also require standards-based descriptions of the KAAS and how to get it running, and executable code and other resources.

Supports:

### Describing KAAR (common vocabularies and standard identifiers; suitable as a SIP)

### Describing KAAS (KOIO and OpenAPI)

### Linking CBK with supporting/corroborative sources, incl. provenance 

### Additional domain and other descriptive metadata (is extensible)

### Versioning (both resource and service; e.g. artifact and API versioning)

### Some access to relevant artifacts in the package (KAAR/KAAS)

### Insuring the integrity of the package (at least as a whole) at the point of deployment

### Storage diversity (both LDP/RDF/Graph and simple file/cache storage)

### Ability to package multiple KOs as a collection with some integrity checks
