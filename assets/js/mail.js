/*----------------------------------------------------------------
            Index Page email
-----------------------------------------------------------------*/
$('#index_form').submit(function(e) {

    e.preventDefault();

    var ajax 		= 	'mail.php',
        name  		= 	$('#name').val(),
        email  		= 	$('#email').val(),
        department	= 	$('#department').val(),
        number		= 	$('#number').val(),
        message		= 	$('#message').val(),
        url         =   $(location).attr("href");
        
    if(name != ''  && email != '' && message != ''){

        $('.loading').addClass('show');
        $('#submitbtn').addClass('hide');

        $.post(ajax, { 
            action          : 'index', 
            name            : name,
            email           : email,
            department      : department,
            number          : number,
            message         : message,
            URL             : url }, 
            function(data){  
                
                var datas = JSON.parse(data); 
                if(datas.success){                    
                    Swal.fire(
                        'Request Sent!',
                        'Your information has been received. Please expect a response within 24-48 hours. Thank You!!',
                        'success'
                    )
                    $('#name').val('');
                    $('#email').val('');
                    $('#message').val('');
                }else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...!',
                        text: 'Message could not be sent!'
                    })
                }

                $('.loading').removeClass('show');
                $('#submitbtn').removeClass('hide');
                
            });
    }else{
        if(name===''){
            $('#name').addClass('redborder');
            $('#name').keyup(function(){ $(this).removeClass('redborder');});
        }
        if(email===''){
            $('#email').addClass('redborder');
            $('#email').keyup(function(){ $(this).removeClass('redborder');});
        }
        if(message===''){
            $('#message').addClass('redborder');
            $('#message').keyup(function(){ $(this).removeClass('redborder');});
        }

    }
    });




/*----------------------------------------------------------------
            Contact Page email
-----------------------------------------------------------------*/
$('#contact_form').submit(function(e) {
    e.preventDefault();    

    var ajax 		= 	'mail.php',
        name  		= 	$('#name').val(),
        email  		= 	$('#email').val(),
        department	= 	$('#department').val(),
        number		= 	$('#number').val(),
        message		= 	$('#message').val(),
        files       = 	$('#applications').prop("files"),
        url         =   $(location).attr("href");


       
        // console.log(files);
        
    if(name != ''  && email != '' && message != ''){

        $('.loading').addClass('show');
        $('#submitbtn').addClass('hide');

        var formData = new FormData();
            formData.append("action", 'contact');
            formData.append("name", name);
            formData.append("email", email);
            formData.append("department", department);

            var totalfiles = files.length;
            for (var index = 0; index < totalfiles; index++) {
                formData.append("files[]", files[index]);
            }

            formData.append("message", message);
            formData.append("url", url);



        $.ajax({
                url: 'mail.php',
                data: formData,
                processData: false,
                contentType: false,
                type: 'POST',                
                success: function(data){  
                        
                        var datas = JSON.parse(data); 


                        if(datas.success){                    
                            Swal.fire(
                                'Message Sent!',
                                'Your information has been received. Please expect a response within 24-48 hours. Thank You!!',
                                'success'
                            );
                            $('#name').val('');
                            $('#email').val('');
                            $('#message').val('');

                        }else if(datas.error){
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...!',
                                text: datas.error
                            });
                        }else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...!',
                                text: 'Message could not be sent!'
                            });
                        }

                        $('.loading').removeClass('show');
                        $('#submitbtn').removeClass('hide');
                        
                }
            });
    }else{
        if(name===''){
            $('#name').addClass('redborder');
            $('#name').keyup(function(){ $(this).removeClass('redborder');});
        }
        if(email===''){
            $('#email').addClass('redborder');
            $('#email').keyup(function(){ $(this).removeClass('redborder');});
        }
        if(message===''){
            $('#message').addClass('redborder');
            $('#message').keyup(function(){ $(this).removeClass('redborder');});
        }

    }
});


// File Manager ------------------

console.clear();

const fileManager = document.querySelector('[js-file-manager]');

class FileManager {
  static chipTemplate = (text, id) => {
    return `<span id="${id}" class="chip"><span class="chip__text">${text}</span></span>`;
  }
  
  static generateId = () => {
    return `chip-${(Math.random()*0xFFFFFF<<0).toString(16)}`;
  }

  constructor(containerElement) {
    this._containerElement = containerElement;
    this._fakeInput = this._containerElement.querySelector('[js-fake-file-input]');
    this._realInput = this._containerElement.querySelector('[js-real-file-input]');
    this._chipContainer = this._containerElement.querySelector('[js-chip-container]');
    this._noFile = this._containerElement.querySelector('[js-no-file]');
    this._removeFilesButton = this._containerElement.querySelector('[js-remove-files]');
    
    this._files = [];
    
    this._addEventListeners();
  }

  _addEventListeners = () => {
    this._fakeInput.addEventListener('click', this._handleFakeInputClick, false);
    this._realInput.addEventListener('change', this._handleRealInputChange, false);
    this._removeFilesButton.addEventListener('click', this._handleRemoveFilesButtonClick, false);
  }
  
  _handleFakeInputClick = () => {
    if (this._chipContainer.querySelectorAll('.chip').length > 0) {
      this._removeChips();
    }
    
    this._realInput.click();
  }
  
  _handleRealInputChange = (e) => {
    if (this._realInput.files.length > 0) {
      this._toggleNoFile();
      [...this._realInput.files].forEach(file => {
        const name = file.name;
        const id = FileManager.generateId();
        const chipTemplate = FileManager.chipTemplate(name, id);
        
        this._chipContainer.insertAdjacentHTML('beforeend', chipTemplate);
        
        const chip = this._chipContainer.querySelector(`#${id}`);
        
        const filesObj = { name, id, chip };
        
        this._files.push(filesObj);
      })
    }
  }
  
  _handleRemoveFilesButtonClick = (e) => {
    if (this._realInput.files.length) {
      this._removeChips();
    }
  }
  
  _removeChips = () => {
    const chips = [...this._chipContainer.querySelectorAll('.chip')];
    this._toggleNoFile();
    this._files = [];
    this._chipContainer.innerHTML = '';
    this._realInput.value = '';
  }

  _toggleNoFile = () => {
    this._noFile.hidden = !this._noFile.hidden;
    this._removeFilesButton.hidden = !this._removeFilesButton.hidden;
  }
}

const fileManagerReference = new FileManager(fileManager);