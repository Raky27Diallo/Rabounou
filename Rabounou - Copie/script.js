document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('employeeTable');
    const form = document.getElementById('formEmploye');
    const modalEmp = new bootstrap.Modal(document.getElementById('modalEmploye'));
    const modalDel = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    
    let idASupprimer = null;

    // --- SÉCURITÉ ANTI-FANTÔMES ---
    // Cette ligne va vider le stockage SEULEMENT si je n'ai pas encore 
    // ajouté de nouveaux employés avec le nouveau système.
    if (!localStorage.getItem('systeme_propre_v2')) {
        localStorage.clear();
        localStorage.setItem('systeme_propre_v2', 'true');
    }

    chargerDonnees();

    // 1. BOUTON AJOUTER
    document.getElementById('btnOuvrirAjout').onclick = () => {
        form.reset();
        document.getElementById('editId').value = "";
        document.getElementById('modalTitle').innerText = "Ajouter un employé";
        modalEmp.show();
    };

    // 2. ACTIONS (MODIFIER / SUPPRIMER)
    tableBody.onclick = (e) => {
        const row = e.target.closest('tr');
        if (!row) return;
        const id = row.getAttribute('data-id');

        if (e.target.closest('.btn-edit')) {
            const employes = JSON.parse(localStorage.getItem('listeEmployes')) || [];
            const emp = employes.find(item => item.id === id);
            if (emp) {
                document.getElementById('editId').value = emp.id;
                document.getElementById('inputMatricule').value = emp.mat;
                document.getElementById('inputPrenom').value = emp.pre;
                document.getElementById('inputNom').value = emp.nom;
                document.getElementById('inputService').value = emp.ser;
                modalEmp.show();
            }
        }

        if (e.target.closest('.btn-delete')) {
            idASupprimer = id;
            modalDel.show();
        }
    };

    // 3. CONFIRMER SUPPRESSION
    document.getElementById('btnConfirmOK').onclick = () => {
        let employes = JSON.parse(localStorage.getItem('listeEmployes')) || [];
        employes = employes.filter(emp => emp.id !== idASupprimer);
        localStorage.setItem('listeEmployes', JSON.stringify(employes));
        chargerDonnees();
        modalDel.hide();
    };

    // 4. ENREGISTRER
    form.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const emp = {
            id: id || Date.now().toString(),
            mat: document.getElementById('inputMatricule').value,
            pre: document.getElementById('inputPrenom').value,
            nom: document.getElementById('inputNom').value,
            ser: document.getElementById('inputService').value
        };

        let employes = JSON.parse(localStorage.getItem('listeEmployes')) || [];
        if (id) {
            employes = employes.map(item => item.id === id ? emp : item);
        } else {
            employes.push(emp);
        }

        localStorage.setItem('listeEmployes', JSON.stringify(employes));
        modalEmp.hide();
        chargerDonnees();
    };

    // 5. AFFICHAGE AVEC BOUTONS TEXTE
    function chargerDonnees() {
        tableBody.innerHTML = "";
        const employes = JSON.parse(localStorage.getItem('listeEmployes')) || [];
        
        if (employes.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-5 text-muted">Le tableau est vide. Ajoutez un employé !</td></tr>';
            return;
        }

        employes.forEach(emp => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', emp.id);
            tr.className = "align-middle";
            tr.innerHTML = `
                <td class="ps-4 fw-bold text-primary">${emp.mat}</td>
                <td>${emp.pre}</td>
                <td>${emp.nom}</td>
                <td><span class="badge bg-dark rounded-pill px-3">${emp.ser}</span></td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-primary btn-edit me-2">Modifier</button>
                    <button type="button" class="btn btn-sm btn-danger btn-delete">Supprimer</button>
                </td>`;
            tableBody.appendChild(tr);
        });
    }
});

