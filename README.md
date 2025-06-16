# Bitacora INFOR
Perfecto. A continuación te dejo el contenido en formato Markdown (`deploy-instructions.md`), considerando que el archivo del frontend es `.env.production`:

# 🛠️ Instructivo de Despliegue — **bitacora-infor**

## 1. Requisitos Previos

Antes de proceder con el despliegue, asegúrese de contar con los siguientes elementos instalados y configurados:

- **Docker** y **Docker Compose** instalados en la máquina anfitriona.
- Un servidor **LDAP (Active Directory)** en funcionamiento, accesible mediante una dirección IP fija en la red local.
- Conectividad entre los dispositivos que requieran acceso al sistema.

---

## 2. Configuración de Variables de Entorno

Es imprescindible **modificar los archivos `.env`** para que reflejen las direcciones IP y credenciales correctas en su entorno de red.

### 2.1 Backend: `/Practica Backend/.env`

```env
LDAP_HOST=ldap://<IP_DEL_SERVIDOR_LDAP>           # Ejemplo: ldap://192.168.2.15
LDAP_PORT=389
LDAP_BIND_DN=CN=ldapuser,OU=Users,DC=example,DC=com
LDAP_BIND_PASSWORD=contraseña_segura
LDAP_BASE_DNS=ou=TIC,dc=example,dc=com;ou=OOPP,dc=example,dc=com

PUBLIC_API_URL=http://<IP_DEL_SERVIDOR>:5000       # Ejemplo: http://192.168.2.15:5000
```

> **Nota:** Asegúrese de que el usuario especificado en `LDAP_BIND_DN` tenga permisos de lectura sobre las unidades organizativas indicadas en `LDAP_BASE_DNS`.

---

### 2.2 Frontend: `/Practica Frontend/bitacora-infor/.env.production`

```env
NEXT_PUBLIC_API_URL=http://<IP_DEL_SERVIDOR>:5000
```

---

## 3. Ejecución del Despliegue

Desde la raíz del proyecto (`/Practicapp`), ejecute el siguiente comando para construir y lanzar los contenedores:

```bash
docker compose up --build -d
```

Esto levantará los servicios de base de datos, backend y frontend en segundo plano.

---

## 4. Acceso a la Aplicación

Una vez desplegada, la aplicación será accesible desde cualquier equipo dentro de la misma red mediante la siguiente dirección:

```
http://<IP_DEL_SERVIDOR>:3000
```

Ejemplo:
`http://192.168.2.15:3000`

