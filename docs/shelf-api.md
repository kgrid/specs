# Introduction

This section is non-normative.

## Purpose

Systems are being designed and built to help move biomedical knowledge into practice more quickly, more broadly, more accurately than ever before. Those systems will rely on long-term access and management of compound digital objects within digital repositories, and deployment and integration of these objects as services in a broad class of runtimes (See KGRID Activation Spec). This requires infrastructural standards and specifications that enable integration at scale.                     

This spec represents our recommendations on how to meet the following needs:

### ...

## Status of this document

This document is draft of a potential specification. It has no official standing of any kind and does not represent the support or consensus of any standards organisation.

## 1. Conformance 

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words <conform>may</conform>, <conform>must</conform>, <conform>must not</conform>, <conform>should</conform>, and <conform>should not</conform> are to be interpreted as described in [RFC2119].

## 2. Terminology

See [KOIO] for matching ontology terms....

#### Knowledge Object:
A collection of metadata and binary files that together have a unique identifier (including version identifier). There are three required file types: a service description, a deployment description, and one or more payload files implementing the service described by the service description, deployable using the information in the deployment description. See [Activation Spec] for details of the roles of the these files.

> KOIO term — koio:KnowledgeObject

## HTTP API

### List KO resources
```
GET /kos HTTP/1.1
Accept: application/json
```
Returns a list of knowledge object resources in a minimal representation

```
HTTP/1.1 200
Content-Type: application/json
[{
"@id": "ipp-lowercholesterol",
"@type": "koio:KnowledgeObject",
"identifier": "ark:/ipp/lowercholesterol",
"version": "v0.0.3",
"title": "Lower Cholesterol Benefit and Risk adjustment",
"contributors": "KGRID TEAM",
"desription": "Retrieve mortality rate set based on race, gender from CDC published life table.",
"citations": [
"https://www.uspreventiveservicestaskforce.org/Page/Name/uspstf-a-and-b-recommendations/"
],
"keywords": [
"Lower Cholesterol",
"Benefit",
"Risk",
"adjustment",
"ipp"
],
"hasServiceSpecification": "service.yaml",
"hasDeploymentSpecification": "deployment.yaml",
"hasPayload": "netbenefit.js",
"@context": [
"http://kgrid.org/koio/contexts/knowledgeobject.jsonld"
]
},
{
"@id": "99999-fk4md04x9z",
"@type": "koio:KnowledgeObject",
"identifier": "ark:/99999/fk4md04x9z",
"version": "0.1.0",
"title": "CPIC Genotype - Phenotype for CYP3A5",
"contributors": "KGRID TEAM",
"description": "KGrid CPIC guidelines Genotype to Phenotype for CYP3A5",
"citations": [
"https://link"
],
"keywords": [
"CPIC",
"CYP3A5",
"Genotype",
"Phenotype"
],
"hasServiceSpecification": "service.yaml",
"hasDeploymentSpecification": "deployment.yaml",
"hasPayload": "phenotype.js",
"@context": [
"http://kgrid.org/koio/contexts/knowledgeobject.jsonld"
]
}]
```

